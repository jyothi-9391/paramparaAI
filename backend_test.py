#!/usr/bin/env python3
"""
Comprehensive Backend Testing for ParamparaSmritiAI Cultural Heritage System
Tests all AI-powered features and endpoints
"""

import requests
import json
import os
import tempfile
import time
from pathlib import Path
from typing import Dict, Any, List

# Configuration
BACKEND_URL = "https://culturecode-ai.preview.emergentagent.com/api"
TEST_USER_ID = "test_user_cultural_heritage_2025"

class ParamparaSmritiAITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_documents = []
        self.created_songs = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                services = data.get("services", {})
                
                # Check all required services
                required_services = ["mongodb", "llm", "embeddings"]
                all_healthy = all(services.get(service) in ["connected", "ready", "loaded"] 
                                for service in required_services)
                
                if all_healthy:
                    self.log_test("Health Check", True, 
                                f"All services healthy: {services}", data)
                else:
                    self.log_test("Health Check", False, 
                                f"Some services unhealthy: {services}", data)
            else:
                self.log_test("Health Check", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
    
    def test_ocr_upload(self):
        """Test OCR document upload endpoint"""
        try:
            # Create a test document file
            test_content = "प्राचीन संस्कृत श्लोक\nसर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥"
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as f:
                f.write(test_content)
                temp_file_path = f.name
            
            # Test OCR upload
            with open(temp_file_path, 'rb') as f:
                files = {'file': ('sanskrit_manuscript.txt', f, 'text/plain')}
                data = {
                    'script_type': 'devanagari',
                    'language': 'sanskrit'
                }
                
                response = self.session.post(f"{self.base_url}/ocr/upload", 
                                           files=files, data=data, timeout=30)
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            if response.status_code == 200:
                result = response.json()
                document_id = result.get("document_id")
                
                if document_id and result.get("status") == "success":
                    self.created_documents.append(document_id)
                    self.log_test("OCR Upload", True, 
                                f"Document created with ID: {document_id}", result)
                else:
                    self.log_test("OCR Upload", False, 
                                f"Missing document_id or failed status", result)
            else:
                self.log_test("OCR Upload", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("OCR Upload", False, f"Error: {str(e)}")
    
    def test_ai_restoration(self):
        """Test AI-powered text restoration"""
        try:
            # Test with damaged Sanskrit text
            damaged_text = "सर्वे भव_तु सुखिनः सर्वे स_तु निरामयाः। मा कश्चि__ुःखभाग्भवेत्"
            
            payload = {
                "text": damaged_text,
                "language": "sanskrit",
                "context": "Ancient Sanskrit blessing verse"
            }
            
            response = self.session.post(f"{self.base_url}/restore", 
                                       json=payload, timeout=45)
            
            if response.status_code == 200:
                result = response.json()
                restored_text = result.get("restored_text")
                confidence = result.get("confidence", 0)
                
                if restored_text and confidence > 0:
                    self.log_test("AI Restoration", True, 
                                f"Text restored with confidence: {confidence}", result)
                else:
                    self.log_test("AI Restoration", False, 
                                f"Missing restored text or confidence", result)
            else:
                self.log_test("AI Restoration", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("AI Restoration", False, f"Error: {str(e)}")
    
    def test_translation(self):
        """Test culturally-aware translation"""
        try:
            # Test Hindi to English translation
            payload = {
                "text": "धर्मो रक्षति रक्षितः। सत्यमेव जयते।",
                "source_language": "sanskrit",
                "target_language": "english"
            }
            
            response = self.session.post(f"{self.base_url}/translate", 
                                       json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                translated_text = result.get("translated_text")
                cultural_notes = result.get("cultural_notes")
                
                if translated_text:
                    self.log_test("Translation", True, 
                                f"Translation successful with cultural notes", result)
                else:
                    self.log_test("Translation", False, 
                                f"Missing translated text", result)
            else:
                self.log_test("Translation", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Translation", False, f"Error: {str(e)}")
    
    def test_speech_upload(self):
        """Test folk song audio upload and transcription"""
        try:
            # Create a dummy audio file for testing
            audio_content = b"RIFF\x24\x08\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x02\x00\x22\x56\x00\x00\x88\x58\x01\x00\x04\x00\x10\x00data\x00\x08\x00\x00"
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
                f.write(audio_content)
                temp_audio_path = f.name
            
            # Test speech upload
            with open(temp_audio_path, 'rb') as f:
                files = {'file': ('folk_song.wav', f, 'audio/wav')}
                data = {
                    'performer': 'Lata Mangeshkar',
                    'region': 'Maharashtra',
                    'language': 'marathi'
                }
                
                response = self.session.post(f"{self.base_url}/speech/upload", 
                                           files=files, data=data, timeout=30)
            
            # Clean up temp file
            os.unlink(temp_audio_path)
            
            if response.status_code == 200:
                result = response.json()
                song_id = result.get("song_id")
                transcription = result.get("transcription")
                
                if song_id and transcription:
                    self.created_songs.append(song_id)
                    self.log_test("Speech Upload", True, 
                                f"Folk song processed with ID: {song_id}", result)
                else:
                    self.log_test("Speech Upload", False, 
                                f"Missing song_id or transcription", result)
            else:
                self.log_test("Speech Upload", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Speech Upload", False, f"Error: {str(e)}")
    
    def test_story_generation(self):
        """Test interactive storytelling engine"""
        try:
            # First, ensure we have a document to work with
            if not self.created_documents:
                self.log_test("Story Generation", False, 
                            "No documents available for story generation")
                return
            
            document_id = self.created_documents[0]
            
            # Test different story types
            story_types = ["summary", "interactive", "quiz"]
            
            for story_type in story_types:
                payload = {
                    "document_id": document_id,
                    "story_type": story_type,
                    "target_language": "english"
                }
                
                response = self.session.post(f"{self.base_url}/story/generate", 
                                           json=payload, timeout=60)
                
                if response.status_code == 200:
                    result = response.json()
                    story_id = result.get("story_id")
                    content = result.get("content")
                    
                    if story_id and content:
                        self.log_test(f"Story Generation ({story_type})", True, 
                                    f"Story created with ID: {story_id}")
                    else:
                        self.log_test(f"Story Generation ({story_type})", False, 
                                    f"Missing story_id or content", result)
                else:
                    self.log_test(f"Story Generation ({story_type})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Story Generation", False, f"Error: {str(e)}")
    
    def test_semantic_search(self):
        """Test semantic and keyword search"""
        try:
            # Test semantic search
            search_queries = [
                {"query": "ancient Sanskrit wisdom", "search_type": "semantic"},
                {"query": "cultural heritage", "search_type": "keyword"},
                {"query": "folk songs Maharashtra", "search_type": "semantic"}
            ]
            
            for query_data in search_queries:
                payload = {
                    "query": query_data["query"],
                    "search_type": query_data["search_type"],
                    "limit": 5
                }
                
                response = self.session.post(f"{self.base_url}/search", 
                                           json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    results = result.get("results", [])
                    total_found = result.get("total_found", 0)
                    
                    self.log_test(f"Search ({query_data['search_type']})", True, 
                                f"Found {total_found} results for '{query_data['query']}'", 
                                {"total_found": total_found})
                else:
                    self.log_test(f"Search ({query_data['search_type']})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Semantic Search", False, f"Error: {str(e)}")
    
    def test_gamification_system(self):
        """Test user progress and badge system"""
        try:
            # Test get user progress
            response = self.session.get(f"{self.base_url}/user/{TEST_USER_ID}/progress", 
                                      timeout=10)
            
            if response.status_code == 200:
                progress = response.json()
                user_id = progress.get("user_id")
                
                if user_id == TEST_USER_ID:
                    self.log_test("User Progress", True, 
                                f"User progress retrieved successfully", progress)
                else:
                    self.log_test("User Progress", False, 
                                f"Incorrect user_id returned", progress)
            else:
                self.log_test("User Progress", False, 
                            f"HTTP {response.status_code}: {response.text}")
            
            # Test badge awarding
            badges_to_test = ["Cultural Explorer", "Sanskrit Scholar", "Folk Song Collector"]
            
            for badge in badges_to_test:
                response = self.session.post(f"{self.base_url}/user/{TEST_USER_ID}/badge/{badge}", 
                                           timeout=10)
                
                if response.status_code == 200:
                    result = response.json()
                    message = result.get("message", "")
                    points = result.get("points", 0)
                    
                    if badge in message and points > 0:
                        self.log_test(f"Badge Award ({badge})", True, 
                                    f"Badge awarded with {points} points")
                    else:
                        self.log_test(f"Badge Award ({badge})", False, 
                                    f"Invalid response", result)
                else:
                    self.log_test(f"Badge Award ({badge})", False, 
                                f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Gamification System", False, f"Error: {str(e)}")
    
    def test_data_retrieval(self):
        """Test document and folk song retrieval endpoints"""
        try:
            # Test get all documents
            response = self.session.get(f"{self.base_url}/documents", timeout=10)
            
            if response.status_code == 200:
                documents = response.json()
                self.log_test("Get Documents", True, 
                            f"Retrieved {len(documents)} documents")
            else:
                self.log_test("Get Documents", False, 
                            f"HTTP {response.status_code}: {response.text}")
            
            # Test get all folk songs
            response = self.session.get(f"{self.base_url}/folk-songs", timeout=10)
            
            if response.status_code == 200:
                songs = response.json()
                self.log_test("Get Folk Songs", True, 
                            f"Retrieved {len(songs)} folk songs")
            else:
                self.log_test("Get Folk Songs", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Data Retrieval", False, f"Error: {str(e)}")
    
    def test_vr_placeholder(self):
        """Test VR preview placeholder endpoint"""
        try:
            if not self.created_documents:
                test_doc_id = "test-document-id"
            else:
                test_doc_id = self.created_documents[0]
            
            response = self.session.get(f"{self.base_url}/vr/preview/{test_doc_id}", 
                                      timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                message = result.get("message", "")
                features = result.get("features", [])
                
                if "3D artifact preview" in message and len(features) > 0:
                    self.log_test("VR Placeholder", True, 
                                f"VR endpoint working with {len(features)} features")
                else:
                    self.log_test("VR Placeholder", False, 
                                f"Invalid VR response", result)
            else:
                self.log_test("VR Placeholder", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("VR Placeholder", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting ParamparaSmritiAI Backend Testing...")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Core system tests
        self.test_health_check()
        
        # AI-powered feature tests
        self.test_ocr_upload()
        self.test_ai_restoration()
        self.test_translation()
        self.test_speech_upload()
        self.test_story_generation()
        self.test_semantic_search()
        
        # Gamification tests
        self.test_gamification_system()
        
        # Data retrieval tests
        self.test_data_retrieval()
        
        # Additional features
        self.test_vr_placeholder()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n📈 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"  {status} {result['test']}")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

def main():
    """Main testing function"""
    tester = ParamparaSmritiAITester()
    summary = tester.run_all_tests()
    
    # Save results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    print(f"\n💾 Test results saved to: /app/backend_test_results.json")
    
    return summary

if __name__ == "__main__":
    main()