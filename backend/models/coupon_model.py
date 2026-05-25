from pydantic import BaseModel

class CouponData(BaseModel):
    coupon_id: str
    pid: str
    food_preference: str
    flag: int