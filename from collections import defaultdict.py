from collections import defaultdict

MOD = 1000000007
 


def modPower(x, y):
 

   

    res = 1
 

  

    x = x % MOD
 

    

  

    if (x == 0):

        return 0
 

    while (y > 0):
 

        

        if (y & 1):
 

        

            res = (res * x) % MOD
 

        

        y = y // 2

        x = (x * x) % MOD
 

    return res
 


def countPairs(arr, N):
    pairCount = 0

    hash1 = defaultdict(int)

    for i in range(N):

        hash1[arr[i]] += 1
 

    for i in range(N):

        modularInverse = modPower(arr[i], 

                                  MOD - 2)


        pairCount += hash1[modularInverse]


        if (arr[i] == modularInverse):
 
            pairCount -= 1

    return pairCount // 2
 


if name == "main":
 
 N = input()
 arr=list(map(int,input("\nEnter the numbers : ").strip().split()))[:n]
print(countPairs(arr, N))