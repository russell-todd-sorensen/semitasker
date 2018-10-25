data NestedList a = Elem a
                  | List [NestedList a]
                    deriving (Eq)

myFlatten :: NestedList  a -> [a]
myFlatten (List []) = []
myFlatten (Elem x) = [x]
myFlatten (List [x])  = myFlatten x
myFlatten (List (x:xs)) = myFlatten x ++ myFlatten (List xs)

--myFlatten (List [Elem 1, List [Elem 2, List [Elem 3, Elem 4], Elem 5]])
--[1,2,3,4,5]
