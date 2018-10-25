module RemoveAt where

removeAt :: Int -> [a] -> (a,[a])
removeAt 1 (x:xs) = (x,xs)
removeAt n xs = (takeOne (drop (n - 1) (take n xs)), (take (n - 1) xs) ++ drop n xs)

takeOne :: [a] -> a
takeOne [x] = x
