module DropEvery where

dropEvery :: [a] -> Int -> [a]
dropEvery [] _  = []
dropEvery  _ 1  = []
dropEvery [x] _ = [x]
dropEvery xs n = nextN xs (n - 1) ++ dropEvery (drop n xs) n


nextN :: [a] -> Int -> [a]
nextN [x] 1 = [x]
nextN [x] 0 = []
nextN   _ 0 = []
nextN  [] _ = []
nextN (x:xs) n | n > 1 = x : nextN xs (n - 1)
               | otherwise = [x]
