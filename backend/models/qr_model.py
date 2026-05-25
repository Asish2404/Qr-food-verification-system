from pydantic import BaseModel

class QRRequest(BaseModel):
    qr_data: str