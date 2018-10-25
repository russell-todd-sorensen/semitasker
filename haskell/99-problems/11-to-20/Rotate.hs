module Rotate where

rotate :: [a] -> Int -> [a]
rotate xs 0 = xs
rotate [x] _ = [x]
rotate (x:xs) n = rotate (xs++[x]) (n - 1)
