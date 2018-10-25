isPalindrome :: (Eq a) => [a] -> Bool
isPalindrome []  = True
isPalindrome [x] = True
isPalindrome m = (m == reverse' m)

reverse' :: [a] ->[a]
reverse' [] = []
reverse' [x] = [x]
reverse' (x:xs) = (reverse' xs) ++ [x]
