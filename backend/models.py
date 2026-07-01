from pydantic import BaseModel, EmailStr

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class ThreadCreate(BaseModel):
    title: str
    content: str
    author: str


class CommentCreate(BaseModel):
    content: str
    author: str
