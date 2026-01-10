"""
Test script to verify XP backend sync functionality
"""
import requests
import json

API_BASE_URL = "http://127.0.0.1:5000"

def test_add_xp():
    """Test the updated /api/addxp endpoint"""
    
    # Test data - you'll need to replace this with a real user_id from your database
    test_user_id = "test-user-id-here"  # Replace with actual user_id
    xp_delta = 50
    
    print("Testing /api/addxp endpoint...")
    print(f"User ID: {test_user_id}")
    print(f"XP Delta: {xp_delta}")
    
    # Make the request
    response = requests.post(
        f"{API_BASE_URL}/api/addxp",
        headers={"Content-Type": "application/json"},
        json={"user_id": test_user_id, "xp": xp_delta}
    )
    
    print(f"\nResponse Status: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    if response.status_code == 200:
        print("\n[SUCCESS] XP update successful!")
        return True
    else:
        print("\n[FAILED] XP update failed!")
        return False

def test_leaderboard():
    """Test the leaderboard endpoint"""
    
    print("\n" + "="*50)
    print("Testing /api/leaderboard endpoint...")
    
    response = requests.get(f"{API_BASE_URL}/api/leaderboard")
    
    print(f"Response Status: {response.status_code}")
    
    if response.status_code == 200:
        leaderboard = response.json()
        print(f"\n[SUCCESS] Leaderboard fetched successfully!")
        print(f"Total players: {len(leaderboard)}")
        print("\nTop 5 Players:")
        for i, player in enumerate(leaderboard[:5], 1):
            print(f"  {i}. {player.get('username', 'Unknown')} - {player.get('xp', 0)} XP")
        return True
    else:
        print("\n[FAILED] Leaderboard fetch failed!")
        print(f"Error: {response.text}")
        return False

if __name__ == "__main__":
    print("="*50)
    print("XP Backend Sync Test Suite")
    print("="*50)
    
    # Test leaderboard first (doesn't require user_id)
    test_leaderboard()
    
    print("\n" + "="*50)
    print("\nNote: To test XP updates, you need to:")
    print("1. Get a valid user_id from your database")
    print("2. Update the test_user_id variable in this script")
    print("3. Run test_add_xp()")
    print("="*50)
