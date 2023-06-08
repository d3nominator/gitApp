#include <bits/stdc++.h>
using namespace std;

#ifdef LOCAL
#include "header/debug.h"
#else
#define debug(x...) 42
#endif 

#define int long long
#define ll long long

ll freq[1000007];

constexpr ll INF = 1000000007;

bool isPalindrome(int n) {
    string str = to_string(n);
    int len = str.length();
    for (int i = 0; i < len / 2; i++) {
        if (str[i] != str[len - 1 - i])
            return false;
    }
    return true;
}

vector<int> pall;


void generatePalindromes(int n) {
    for (int i = 0; i <= n; i++) {
        if (isPalindrome(i))
            pall.push_back(i);
    }
}

void solve() {
    
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &val : v) 
        cin >> val;

  
    memset(freq,0,sizeof(freq));
    
    ll ans = 0;
     for(auto &a : v){
        freq[a] += 1;
        for(auto &b : pall){
            ans += freq[b ^ a];
        }
    
    }

    cout << ans << endl;
    // cout << endl;
}

signed main() {
    ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr);
    int tt = 1;
    cin >> tt;
    
    pall.clear();
    generatePalindromes(32768);
    while (tt--) {
        solve();
    }
}