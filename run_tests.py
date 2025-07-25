#!/usr/bin/env python3
"""
Quantum Factory Test Runner
Runs the test suite locally using a simple HTTP server and headless browser
"""

import os
import sys
import time
import threading
import http.server
import socketserver
from urllib.parse import urljoin

def start_server(port=8000):
    """Start a simple HTTP server in the current directory"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = http.server.SimpleHTTPRequestHandler
    httpd = socketserver.TCPServer(("", port), handler)
    
    print(f"Starting HTTP server on port {port}...")
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    return httpd, f"http://localhost:{port}"

def run_tests_with_requests(base_url):
    """Run tests using requests library (fallback method)"""
    try:
        import requests
        
        test_url = urljoin(base_url, "test.html")
        print(f"Attempting to load test page: {test_url}")
        
        response = requests.get(test_url)
        if response.status_code == 200:
            print("✓ Test page loaded successfully")
            print("⚠️  Manual verification required - open the following URL in your browser:")
            print(f"   {test_url}")
            print("   Check the test results in the browser console")
            return True
        else:
            print(f"✗ Failed to load test page (status: {response.status_code})")
            return False
            
    except ImportError:
        print("✗ requests library not available")
        return False
    except Exception as e:
        print(f"✗ Error running tests: {e}")
        return False

def run_tests_with_selenium(base_url):
    """Run tests using selenium (preferred method)"""
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        
        # Setup Chrome options for headless mode
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        print("Starting headless Chrome browser...")
        driver = webdriver.Chrome(options=chrome_options)
        
        try:
            test_url = urljoin(base_url, "test.html")
            print(f"Loading test page: {test_url}")
            driver.get(test_url)
            
            # Wait for tests to complete (up to 30 seconds)
            print("Waiting for tests to complete...")
            wait = WebDriverWait(driver, 30)
            
            # Wait for the test results to appear
            wait.until(EC.presence_of_element_located((By.ID, "mocha")))
            time.sleep(3)  # Give tests time to run
            
            # Get test results
            mocha_stats = driver.find_elements(By.CSS_SELECTOR, ".stats")
            if mocha_stats:
                stats_text = mocha_stats[0].text
                print(f"Test Results: {stats_text}")
            
            # Check for failures
            failures = driver.find_elements(By.CSS_SELECTOR, ".failures")
            if failures and failures[0].text.strip():
                print("✗ Test Failures Found:")
                print(failures[0].text)
                return False
            else:
                print("✓ All tests passed!")
                return True
                
        finally:
            driver.quit()
            
    except ImportError:
        print("✗ Selenium not available. Install with: pip install selenium")
        return False
    except Exception as e:
        print(f"✗ Error running tests with selenium: {e}")
        return False

def main():
    """Main test runner function"""
    print("=" * 50)
    print("QUANTUM FACTORY TEST RUNNER")
    print("=" * 50)
    
    # Start HTTP server
    try:
        httpd, base_url = start_server()
        print(f"✓ Server started at {base_url}")
        
        # Give server time to start
        time.sleep(1)
        
        # Try to run tests with selenium first, then fallback to manual
        print("\nRunning tests...")
        success = run_tests_with_selenium(base_url)
        
        if not success:
            print("\nFalling back to manual test verification...")
            run_tests_with_requests(base_url)
        
        print("\nTest run completed.")
        print("Press Ctrl+C to stop the server")
        
        # Keep server running for manual inspection
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()
            
    except Exception as e:
        print(f"✗ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 