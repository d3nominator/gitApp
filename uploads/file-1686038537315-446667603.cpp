#include "bits/stdc++.h"
using namespace std;

#ifdef LOCAL
#include "header/debug.h"
#else
#define debug(x...) 42
#endif
#define JAI_SHREE_RAAM ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr), cout.precision(20), cout.setf(ios::fixed);

#define int long long
#define ll long long

constexpr ll INF = 1000000007;

void solve() {
    int n;
    cin >> n;
    string s;
    cin >> s;
    if ( n == 1 ){
        if ( s[0] == 'a'){
            cout << "1\n";
            return;
        }
        cout << "-1\n";
        return;
    }
    for(int i = 0 ; i < n ; i++){
        if( i + 1 < n ){
            if ( s[i] == 'a' && s[i+1] == 'a'){
                cout << "2\n";
                return;
            }
        }
        if ( i + 2 < n ){
            if ( s[i] == 'a' && s[i+2] == 'a'){
                cout << "3\n";
                return;
            }
        }
    }
    cout << "-1\n";
}

signed main() {
    JAI_SHREE_RAAM;
    int tt = 1;
    cin >> tt;
    while (tt--) {
        solve();
    }
}