listLength :: [a] -> Int
listLength [] = 0
listLength (x:xs) = 1 + listLength xs
