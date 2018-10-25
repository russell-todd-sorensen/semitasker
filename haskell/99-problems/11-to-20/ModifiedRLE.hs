module ModifiedRLE where
data CodePoint a = Multiple Int a
                 | Single a
                 | EmptyList
                 deriving (Show, Eq)

modRLE :: (Eq a) => [a] -> [CodePoint a]
modRLE [] = []
modRLE [x] = [Single x]
modRLE (x:xs) = cp : gs
                where ax = gather x xs
                      n  = (length ax) + 1
                      ys = drop (n - 1) xs
                      n2 = length ys
                      cp | n == 1 = Single x
                         | otherwise = Multiple n x
                      gs | n2 == 0 = []
                         | otherwise = modRLE ys

countIt :: (Eq a) => [a] -> [(Int, a)]
countIt [] = []
countIt [x] = [(1,x)]
countIt (x:xs) = (n,x) : gs
                 where  ax = gather x xs
                        n  = (length ax) + 1
                        ys = drop (n - 1) xs
                        n2 = length ys
                        gs  | n2 == 0 = []
                            | otherwise = countIt ys


gather :: (Eq a) => a -> [a] -> [a]
gather _ [] = []
gather x (y:ys) | x == y = y : gather x ys
                | otherwise = []

chomp :: (Eq a) => [a] -> [CodePoint a]
chomp [] = []
chomp [x] = [Single x]
chomp (x:xs) = cp : cs
               where n  = 1 + (nibble x xs)
                     cp | n == 1 = Single x
                        | otherwise = Multiple n x
                     ys = drop (n - 1) xs
                     cs = chomp ys

nibble :: (Eq a) => a -> [a] -> Int
nibble _ [] = 0
nibble x [y] | x == y = 1
             | otherwise = 0
nibble x (y:ys) | x == y = 1 + (nibble x ys)
                | otherwise = 0

encodeDirect :: (Eq a) => [a] -> [CodePoint a]
encodeDirect = chomp

getSingle (Single x) = [x]

getMultiple (Multiple n x) | n == 1 = [x]
                           | otherwise = x : nList (n - 1) x

nList :: Int -> a -> [a]
nList 0 _ = []
nList 1 x = [x]
nList n x = x : nList (n - 1) x

decodeModified :: [CodePoint a] -> [a]
decodeModified [Single x] = [x]
decodeModified [Multiple n x] = nList n x
decodeModified ((Single x):xs) = x : decodeModified xs
decodeModified ((Multiple n x):xs) = (nList n x) ++ decodeModified xs

dupli :: [a] -> [a]
dupli [] = []
dupli [x] = [x,x]
dupli (x:xs) = x:x:dupli xs

repli :: [a] -> Int -> [a]
repli [] _ = []
repli xs 1 = xs
repli [x] n = nList n x
repli (x:xs) n = (nList n x) ++ repli xs n
