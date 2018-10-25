reverseIt :: [a] -> [a]
reverseIt [] = []
reverseIt [x] = [x]
reverseIt (x:xs) = (reverseIt xs) ++ [x] 
