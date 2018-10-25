range :: Int -> Int -> [Int]
range n m | m < n = []
          | otherwise = n : range (n + 1) m

range' :: (Ord a, Eq a, Enum a) => a -> a -> [a]
range' x y = [x..y]
