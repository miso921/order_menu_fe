import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import PortOne from "@portone/browser-sdk/v2";

const CartMenuPopup = (prop) => {
    const [cartItems, setCartItems] = useState(null);
    const [groupedItems, setGroupedItems] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE"
    });

    const getCartList = async () => {
        const orderNum = prop.orderNum;
        try {
            const response = await axios.get("/api/v1/menu/cart-list", {
                params: {
                    orderNum: orderNum
                }
            });

            if (response.data?.data?.[0]?.selectMenu) {
                setCartItems(response.data.data[0]);
                groupMenuItems(response.data.data[0].selectMenu);
            }
        } catch (e) {
            console.log("장바구니 조회 오류", e);
        }
    };

    const groupMenuItems = (items) => {
        const groups = [];
        let currentGroup = null;

        items.forEach(item => {
            if (item.optionYn === 'N') {
                if (currentGroup) {
                    groups.push(currentGroup);
                }
                currentGroup = {
                    mainMenu: item,
                    options: [],
                    totalPrice: item.price
                };
            }
            else if (item.optionYn === 'Y' && currentGroup) {
                currentGroup.options.push(item);
                currentGroup.totalPrice += item.price;
            }
        });

        if (currentGroup) {
            groups.push(currentGroup);
        }

        setGroupedItems(groups);
    };

    const handleDelete = async (seq) => {
        try {
            await axios.delete(`/api/v1/menu/cart/${seq}`);
            getCartList();
        } catch (e) {
            console.warn(e);
        }
    };

    const handlePayment = async () => {
        setPaymentStatus({ status: "PENDING" });
        const paymentId = [...crypto.getRandomValues(new Uint32Array(2))]
            .map((word) => word.toString(16).padStart(8, "0"))
            .join("");

        try {
            const payment = await PortOne.requestPayment({
                storeId: "store-cbc58933-71b5-4213-9c48-cfa96f31b4bd",
                channelKey: "channel-key-2c79afda-d9dd-4e0a-9481-aeff0cc358be",
                paymentId,
                orderName: "주문", // 또는 첫 번째 메뉴 이름 등으로 설정
                // orderName: groupedItems[0]?.mainMenu?.name || "주문",
                totalAmount: 1, // todo : 전체 값
                currency: "KRW",
                payMethod: "CARD",
                cardCompany:"HYUNDAI_CARD",
                availableCards : [
                    {useInstallment : false}
                ],
                customData: {
                    fullName : '이미소',
                    phoneNumber:'01096730921',
                    email:'misoo921@naver.com',
                    orderNum: prop.orderNum
                },
            });

            if (payment.code !== undefined) {
                setPaymentStatus({
                    status: "FAILED",
                    message: payment.message
                });
                return;
            }

            setPaymentStatus({ status: "PAID" });
        } catch (error) {
            console.error("결제 오류:", error);
            setPaymentStatus({
                status: "FAILED",
                message: "결제 중 오류가 발생했습니다."
            });
        }
    };

    const handleClose = () => {
        setPaymentStatus({ status: "IDLE" });
        prop.closeModal();
    };

    useEffect(() => {
        getCartList();
    }, []);

    if (!cartItems) return null;

    const totalOrderPrice = groupedItems.reduce((sum, group) => sum + group.totalPrice, 0);
    const isWaitingPayment = paymentStatus.status !== "IDLE";

    return (
        <>
            <div className="w-full max-w-2xl mx-auto p-4">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-amber-800">
                        <th className="p-2 text-left">번호</th>
                        <th className="p-2 text-left">상품명</th>
                        <th className="p-2 text-left">옵션</th>
                        <th className="p-2 text-right">가격</th>
                        <th className="p-2 w-12"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {groupedItems.map((group, index) => (
                        <>
                            <tr key={group.mainMenu.cartSeq} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">
                                    <div className="flex items-center gap-2">
                                        {group.mainMenu.name}
                                    </div>
                                </td>
                                <td className="p-2">
                                    {group.options.map(opt => opt.name).join(', ')}
                                </td>
                                <td className="p-2 text-right">
                                    {group.mainMenu.price.toLocaleString()}원
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDelete(group.mainMenu.cartSeq)}
                                        className="p-1 hover:bg-black rounded-full"
                                    >
                                        <X className="w-4 h-4 text-gray-500"/>
                                    </button>
                                </td>
                            </tr>
                            {group.options.map((opt) => (
                                <tr key={opt.cartSeq} className="border-b text-sm text-gray-600">
                                    <td className="p-2"></td>
                                    <td className="p-2" colSpan={2}>+ {opt.name}</td>
                                    <td className="p-2 text-right">+{opt.price.toLocaleString()}원</td>
                                    <td className="p-2"></td>
                                </tr>
                            ))}
                        </>
                    ))}
                    <tr className="font-bold">
                        <td className="p-2 text-black" colSpan={3}>총 금액</td>
                        <td className="p-2 text-right text-black">{totalOrderPrice.toLocaleString()}원</td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                <div className="flex justify-between gap-2">
                    <div>
                        <button
                            className="px-10 py-2 bg-red-900 rounded hover:bg-gray-300"
                            onClick={handlePayment}
                            disabled={isWaitingPayment}
                        >
                            결제
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-10 py-2 bg-red-900 rounded hover:bg-gray-300"
                            onClick={prop.closeModal}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>

            {paymentStatus.status === "FAILED" && (
                <dialog open>
                    <header>
                        <h1>결제 실패</h1>
                    </header>
                    <p>{paymentStatus.message}</p>
                    <button type="button" onClick={handleClose}>
                        닫기
                    </button>
                </dialog>
            )}

            <dialog open={paymentStatus.status === "PAID"}>
                <header>
                    <h1>결제 성공</h1>
                </header>
                <p>결제에 성공했습니다.</p>
                <button type="button" onClick={handleClose}>
                    닫기
                </button>
            </dialog>
        </>
    );
};

export default CartMenuPopup;