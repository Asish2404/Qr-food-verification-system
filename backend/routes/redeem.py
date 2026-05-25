from fastapi import APIRouter
from database.db import collection
from models.qr_model import QRRequest
import json

router = APIRouter()

@router.post("/redeem")
async def redeem_coupon(data: QRRequest):

    try:

        print("RAW QR:", data.qr_data)

        qr_json = json.loads(data.qr_data)

        print("PARSED QR:", qr_json)

        coupon_id = qr_json["coupon_id"]

        coupon = collection.find_one({
            "coupon_id": coupon_id
        })

        print("FOUND:", coupon)

        if not coupon:

            return {
                "success": False,
                "message": "Coupon not found"
            }

        # ALREADY REDEEMED
        if coupon["flag"] == 0:

            return {
                "success": False,
                "message": "QR already redeemed"
            }

        # UPDATE FLAG
        result = collection.update_one(
            {
                "coupon_id": coupon_id
            },
            {
                "$set": {
                    "flag": 0
                }
            }
        )

        print("UPDATED:", result.modified_count)

        return {
            "success": True,
            "message": "QR redemption successful"
        }

    except Exception as e:

        print("ERROR:", e)

        return {
            "success": False,
            "message": "Invalid QR Code"
        }