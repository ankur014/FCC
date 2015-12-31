#include <bits/stdc++.h>

using namespace std;

int fx, fy;
int state[3][3];

int check(int k)
{
	int c;

	for (int i = 0; i < 3; i++) {
		c = 0;
		for (int j = 0; j < 3; j++) if(state[i][j] == k) c++;
		if(c == 3) return 1;
	}

	for (int i = 0; i < 3; i++) {
		c = 0;
		for (int j = 0; j < 3; j++) if(state[j][i] == k) c++;
		if(c == 3) return 1;
	}

	c = 0;
	for (int i = 0; i < 3; i++) {
		if(state[i][i] == k) c++;
	}
	if(c == 3) return 1;

	c = 0;
	for (int i = 0; i < 3; i++) {
		if(state[i][2 - i] == k) c++;
	}
	if(c == 3) return 1;

	return 0;
}

int minmax(int idx, int player, int root)
{
	//cout << idx << " " << player << root << endl;
	if(check(0) == 1) return -1;
	if(check(1) == 1) return 1;
	if(idx == 9) return 0;
	
	int ans, temp;
	if(player == 0) ans = 2;
	if(player == 1) ans = -2;
	
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if(state[i][j] == -1){
				if(player == 0){
					state[i][j] = 0;
					temp = minmax(idx + 1, (player + 1) % 2, root);

					if(temp < ans){
						ans = temp;
						if(idx == root) fx = i;
						if(idx == root) fy = j;
					}
					state[i][j] = -1;
				} else {
					state[i][j] = 1;
					temp = minmax(idx + 1, (player + 1) % 2, root);
					
					if(temp > ans){
						ans = temp;
						if(idx == root) fx = i;
						if(idx == root) fy = j;
					}
					state[i][j] = -1;
				}
			}
		}
	}

	return ans;
}

void print()
{
	
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			if(state[i][j] == -1) cout << "_ ";
			else if(state[i][j] == 1) cout << "X ";
			else cout << "O ";
		}
		cout << "\n";
	}
}

int main()
{
	
	int x, y;
    	
	memset(state, -1, sizeof(state));

	for(int i = 0; i <= 8; i += 2){
		cout << "Enter the coordinates:\n";
		cin >> x >> y;
		
		state[x][y] = 1;
		
		if(check(0) == 1) {
			cout << "Player-2 wins!\n";
			return 0;
		}
		if(check(1) == 1) {
			cout << "Player-1 wins!\n";
			return 0;
		}
		
		if(i == 8) break;

		minmax(i + 1, 0, i + 1);
		state[fx][fy] = 0;
		
		print();
		
		if(check(0) == 1) {
			cout << "Player-2 wins!\n";
			return 0;
		}
		if(check(1) == 1) {
			cout << "Player-1 wins!\n";
			return 0;
		}
	}

	cout << "The match is drawn!\n";
    	
    return 0;
}
