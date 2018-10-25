module Combo where

addItemToList :: a -> [a] -> [[a]]
addItemToList x [] = []
addItemToList x [y] = [[x,y]]
addItemToList x (y:xs) = [x,y] : addItemToList x xs

addItemToListOfLists :: a -> [[a]] -> [[a]]
addItemToListOfLists x [] = [] -- this is an empty list of lists!
addItemToListOfLists x [[y]] = [[x,y]]
addItemToListOfLists x (y:ys) = ([x]++y) : addItemToListOfLists x ys

ai :: a -> [[a]] -> [[a]]
ai = addItemToListOfLists

comboInit :: [a] -> [[a]]
comboInit [] = []
comboInit [x] = [[x]]
comboInit [x,y] = [[x],[y]]
comboInit (x:xs) = [x] : comboInit (xs)

-- *Combo> let mlist = "abcdef"
-- *Combo> ai (head mlist) (comboInit (tail mlist))
-- ["ab","ac","ad","ae","af"]

--combo :: Int -> [a] -> [[a]]

combo :: Int -> ([a], [a]) -> [[a]]
combo 0 (_,_) = []
combo 1 ([x],[y]) = [[x],[y]]
combo 1 ([x],[]) = [[x]]
combo 1 ([],[y]) = [[y]]
combo k (x, [y])    | lenX == k       = [x]
                    | lenX == (k - 1) = [x++[y]]
                    | otherwise       = []
                    where lenX = length x

combo k (x, (y:ys)) | lenX == k       = [x]
                    | lenX == (k - 1) = [x++[y]] ++ (combo k (x,ys))
                    | lenX  < k = (combo k (x++[y],ys)) ++ (combo k (x,ys))
                    | otherwise       = []
                    where lenX = length x

combinations :: Int -> [a] -> [[a]]

combinations k xs = combo k ([], xs)
