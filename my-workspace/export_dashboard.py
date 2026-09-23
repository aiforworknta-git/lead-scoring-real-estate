import os
import sys

# Runner script in my-workspace root
script_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'alpha-bi-dashboard', 'export_dashboard.py')
if os.path.exists(script_path):
    sys.path.insert(0, os.path.dirname(script_path))
    import export_dashboard
    export_dashboard.main()
else:
    print(f"Khong tim thay: {script_path}")
