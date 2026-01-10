"""
Visual test to demonstrate progress circle calculations
"""

def calculate_level_from_xp(total_xp):
    """Calculate current level based on total XP"""
    if total_xp < 0:
        return 1
    return (total_xp // 100) + 1

def calculate_progress(current_xp):
    """Calculate progress circle values for given XP"""
    current_level = calculate_level_from_xp(current_xp)
    xp_for_next_level = current_level * 100
    xp_for_current_level = (current_level - 1) * 100
    xp_progress = current_xp - xp_for_current_level
    xp_needed = xp_for_next_level - xp_for_current_level
    progress_percentage = min(100, max(0, (xp_progress / xp_needed) * 100))
    
    return {
        'current_xp': current_xp,
        'current_level': current_level,
        'xp_for_current_level': xp_for_current_level,
        'xp_for_next_level': xp_for_next_level,
        'xp_progress': xp_progress,
        'xp_needed': xp_needed,
        'progress_percentage': round(progress_percentage, 2)
    }

def print_progress_bar(percentage, width=50):
    """Print a visual progress bar"""
    filled = int(width * percentage / 100)
    bar = '#' * filled + '-' * (width - filled)
    return f"[{bar}] {percentage:.1f}%"

def test_xp_values():
    """Test various XP values and display progress"""
    test_cases = [
        0,      # Start of Level 1
        50,     # Middle of Level 1
        99,     # End of Level 1
        100,    # Start of Level 2
        150,    # Middle of Level 2
        199,    # End of Level 2
        200,    # Start of Level 3
        275,    # 75% through Level 3
        300,    # Start of Level 4
        500,    # Start of Level 6
        999,    # End of Level 10
    ]
    
    print("=" * 80)
    print("PROGRESS CIRCLE TEST - XP to Visual Progress")
    print("=" * 80)
    print()
    
    for xp in test_cases:
        result = calculate_progress(xp)
        
        print(f"Total XP: {result['current_xp']}")
        print(f"Current Level: {result['current_level']}")
        print(f"Level Progress: {result['xp_progress']} / {result['xp_needed']} XP")
        print(f"Progress: {print_progress_bar(result['progress_percentage'])}")
        
        if result['xp_progress'] >= result['xp_needed']:
            print("Status: LEVEL COMPLETE!")
        else:
            xp_remaining = result['xp_needed'] - result['xp_progress']
            print(f"Status: {xp_remaining} XP until Level {result['current_level'] + 1}")
        
        print("-" * 80)
        print()

if __name__ == "__main__":
    test_xp_values()
    
    print("\n" + "=" * 80)
    print("INTERACTIVE TEST")
    print("=" * 80)
    print("\nEnter XP values to see progress (or 'q' to quit):")
    
    while True:
        try:
            user_input = input("\nEnter XP: ").strip()
            if user_input.lower() == 'q':
                break
            
            xp = int(user_input)
            result = calculate_progress(xp)
            
            print(f"\nLevel {result['current_level']}")
            print(f"   {print_progress_bar(result['progress_percentage'])}")
            print(f"   {result['xp_progress']} / {result['xp_needed']} XP")
            
        except ValueError:
            print("Please enter a valid number or 'q' to quit")
        except KeyboardInterrupt:
            break
    
    print("\n\nTest complete!")
