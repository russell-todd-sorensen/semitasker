module Lambda where

data Lam =
    Abs (Lam -> Lam)
    | App Lam Lam
    | FreeVar String

--Abs :: (Lam -> Lam) -> Lam
--App :: Lam -> Lam -> Lam

value (Var s) = False
value (Abs x e) = True
value (App e1 e2) = False

f :: Lam -> Lam
f = \x -> App x x

e :: Lam
e = Abs f

id' :: Lam -> Lam
id' = \x -> x

ide' :: Lam
ide' = Abs id'

e' :: Lam
e' = App e ide'

fls = Abs (\t ->
        Abs (\f -> f))

tru = Abs (\t ->
        Abs (\f -> t))

eval :: Lam -> Lam
eval (App (Abs f) v) | value v = f v -- beta rule

eval (App v e2) | value v =
    let e2' = eval e2 in
    App e1' e2

eval (App e1 e2) =
    let e1' = eval e1 in
    App e1' e2

eval (Abs f) = error "Value!"
