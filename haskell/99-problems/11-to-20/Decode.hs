data CodePoint a = Multiple Int a
                 | Single a
                 deriving (Show, Eq)

getMultiple :: (CodePoint a) -> Int
getMultiple (Multiple n x) = n
getMultiple (Single x) = 0
getMember :: (CodePoint a) -> a
getMember [] = []
getMember (Multiple n x) = x
getMember (Single x) = x

decodeModified :: [CodePoint a] -> [a]
decodeModified [] = []
decodeModified [Single x] = [x]
decodeModified (x:xs) | n > 0 = expand n cp -- : decodeModified xs
                      | otherwise =  cp -- : decodeModified xs
                      where n  = getMultiple x
                            cp = getMember x

expand :: Int -> a -> [a]
expand 0 _ = []
expand n x = x : expand (n - 1) x
