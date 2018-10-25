-- = split m (floor (length m)/2)

take' :: Int -> [a] -> [a]
take' 0 (x:xs) = []
take' 1 (x:xs) = [x]
take' n (x:xs) = [x] ++ take' (n - 1) xs
