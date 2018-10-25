module Prime where
import qualified Data.IntMap as IntMap

isPrime :: Int -> Bool
isPrime 0 = False
isPrime 1 = True
isPrime 2 = True
isPrime n | lenFactors == 2 = True
          | otherwise = False
          where lenFactors = length (divisors n)

isPrime' :: Int -> Bool
isPrime' 0 = False
isPrime' 1 = True
isPrime' n | firstDivisor == n = True
           | otherwise = False
           where firstDivisor = nextDiv 2 n

nextDiv :: Int -> Int -> Int
nextDiv k n | ((n `mod` k) == 0) = k
            | otherwise  = nextDiv (k + 1) n

divisors :: Int -> [Int]
divisors 0 = []
divisors 1 = [1,1]
divisors n | n < 1 = divisors ((-1) * n)
           | otherwise = 1 : div' 2 n

div' :: Int -> Int -> [Int]
div' k n | k == n = [n]
         | n `mod` k == 0 = k : div' (k + 1) n
         | otherwise = div' (k + 1) n

gcd' :: Int -> Int -> Int
gcd' 0 m | m < 0 = (-1)*m
         | otherwise  = m

gcd' n 0 | n < 0 = (-1)*n
         | otherwise  = n

gcd' n m | n < 0 = gcd' ((-1)*n) m
         | m < 0 = gcd' n ((-1)*m)
         | n < m = gcd'' m n
         | otherwise = gcd'' n m

gcd'' :: Int -> Int -> Int
gcd'' n m | remainder == 0 = m
          | otherwise = gcd'' m remainder
          where remainder = n `mod` m

coprime :: Int -> Int -> Bool
coprime n m | maxDivisor == 1 = True
            | otherwise = False
            where maxDivisor = gcd' n m

totient :: Int -> Int
totient 0 = 0
totient 1 = 1
totient n | n < 1 = totient ((-1)*n)
          | otherwise = length coprimeList
          where coprimeList = coprimes 1 n

coprimes :: Int -> Int -> [Int]

coprimes k n | k >= n = []
             | isCoprime = k : coprimes (k + 1) n
             | otherwise = coprimes (k + 1) n
             where isCoprime = coprime k n

primeFactors :: Int -> [Int]
primeFactors 0 = []
primeFactors 1 = []
primeFactors 2 = [2]

primeFactors n | n < 0 = primeFactors ((-1)*n)
               -- | isPrime n = [n]
               | otherwise = pFactors2 2 n
{--
pFactors :: Int -> Int -> [Int]

pFactors k n | not (isPrime k) = pFactors (k + 1) n
             | k == n = [k]
             | k  > n = []
             | remainder == 0 = k : pFactors k (n `div` k)
             | otherwise = pFactors (k + 1) n
             where remainder = n `mod` k
--}
pFactors2 :: Int -> Int -> [Int]

pFactors2 k n | not (remainder == 0) = pFactors2 (k + 1) n
              -- | not (isPrime k) = pFactors2 (k + 1) n -- (all divisors are prime)
              | k == n = [k] -- k is now a prime divisor
              -- | k  > n = []
              | otherwise = k : pFactors2 k (n `div` k)
              where remainder = n `mod` k

prime_factors_mult :: Int -> [(Int,Int)]
prime_factors_mult n = gather (primeFactors n)

gather :: [Int] -> [(Int,Int)]
gather [] = []
gather (x:xs) | lenY == 0 = [(x,n)]
              | lenY == 1 = (x,n) : [(head ys,1)]
              | otherwise = (x,n) : gather ys
              where (n,ys) = accum 1 x xs
                    lenY = length ys

accum :: Int -> Int -> [Int] -> (Int,[Int])
accum k x [] = (k,[])
accum k x [y] | x == y = ((k+1), [])
              | otherwise = (k,[y])
accum k x (y:ys) | x == y = accum (k+1) x ys
                 | otherwise = (k,(y:ys))


phi :: Int -> Int
phi n  = phiCalc (prime_factors_mult n)

phiCalc :: [(Int,Int)] -> Int

phiCalc [(p,m)] = (p-1)*(p^(m-1))
phiCalc ((p,m):xs) = (p-1)*(p^(m-1)) * phiCalc xs


primeR :: Int -> Int -> [Int]
primeR n m | n  > m = []
           | ((n == m) && (isPrime' m)) = [m]
           | isPrime' n = n : primeR (n + 1) m
           | otherwise = primeR (n + 1) m

goldbach :: Int -> (Int,Int)
goldbach 2 = (0,0)
goldbach n | n `mod` 2 == 1 = (0,0)
           | otherwise = gbFind 3 n

gbFind :: Int -> Int -> (Int,Int)
gbFind n m | n > m = (0,0)
           | (isPrime' n) && (isPrime' (m-n)) = (n,m-n)
           | otherwise = gbFind (n + 2) m

goldbachList :: Int -> Int -> [(Int,Int)]

goldbachList n m | n `mod` 2 /= 0 = goldbachList (n + 1) m
                 | m `mod` 2 /= 0 = goldbachList n (m - 1)
                 | n > m  = []
                 | otherwise = goldbach n : goldbachList (n + 2) m

goldbachList' :: Int -> Int -> Int -> [(Int,Int)]
goldbachList' n m k | n `mod` 2 /= 0 = goldbachList' (n + 1) m k
                    | m `mod` 2 /= 0 = goldbachList' n (m - 1) k
                    | n > m  = []
                    | r < k || s < k = goldbachList' (n + 2) m k
                    | otherwise = (r,s) : goldbachList' (n + 2) m k
                    where (r,s) = goldbach n
