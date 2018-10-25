module Lambda where

data Lam =
    Var String
    | Abs String Lam
    | App Lam Lam
    deriving Show

--subst :: Lam -> Lam -> Lam -> Lam
--subst (Var y) x v = if x == y then v else Var y
