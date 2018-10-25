module Rand where
import System.Random
import System.IO
import Control.Monad (replicateM)

--rnd_select :: [a] -> Int -> [a]
rnd :: Int -> Int -> IO Int
rnd n m = getStdRandom (randomR (n,m))

--rndInt :: Int -> Int -> Int
--rndInt n m = (rnd n m) :: Int

--rndElement :: [a] -> a
--rndElement xs = xs !! (rndInt 0 ((length xs) - 1))
--g :: IO StdGen
--g <- getStdGen

--specificRand :: (RandomGen a) => Int -> Int -> (Int, a)
--specificRand n m  do
--                    g <- getStdRandom
--                    randomR (n, m)

--g' = StdGen
--rnd' :: RandomGen g => (Int, Int) -> g -> (Int, g)
--rnd' (n,m) g = randomR (n,m) g'
{-
randomListItem :: [a] -> a
randomListItem [] = error "no items in list"
randomListItem list = do
                        g = rnd 0 ((length list)-1)
                        i <- g
                        list !! i
-}
rndList :: Int -> IO [Int]
rndList n = do
            pos <- replicateM n (rnd 0 (n-1))
            return pos

rndList' :: Int -> IO [Int]
rndList' n = do
            pos <- replicateM n (rnd 0 (n-1))
            return [p|p<-pos]

rndList'' :: Int -> [a] -> IO [a]
rndList'' n l = do
            let len = length l
            pos <- replicateM n (rnd 0 (len-1))
            return [l!!p|p<-pos]

rnd_select xs n = do
    gen <- getStdGen
    return $ take n [ xs !! x | x <- randomRs (0, (length xs) -1) gen]

rnd_select' :: [a] -> Int -> IO [a]
rnd_select' xs n
        | n < 0     = error "N must be greater than zero"
        | otherwise = replicateM n rand
            where rand = do r <- randomRIO (0, (length xs) - 1)
                            return (xs!!r)

rndList''' :: Int -> [IO Int]
rndList''' n = do
            pos <- [(rnd 0 i) | i<-[(n-1),(n-2)..0]]
            return pos

removeAt :: Int -> [a] -> [a]
removeAt n xs = (take (n - 1) xs) ++ (drop n xs)

final_rnd_select :: (Show a) => [a] -> Int -> IO ()
final_rnd_select xs n = do
                         fin <- rndList'' n xs
                         print fin
