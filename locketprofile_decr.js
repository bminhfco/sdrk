// Bản đã giải mã hóa hoàn toàn (Fully Deobfuscated)

// Lấy URL của request hiện tại (Dùng trong các app như Shadowrocket/Surge)
const url = typeof $request !== "undefined" ? $request["url"] : '';

function injectBadge(obj) {
    if (!obj || typeof obj !== "object") return;

    // Kiểm tra xem object có chứa các thuộc tính liên quan đến Huy hiệu/Premium không
    if ("badge" in obj || "badge_tier" in obj || "badge_name" in obj || "badge_number" in obj) {
        // Tiêm thông tin Premium vào Object
        obj["badge"] = "gold";
        obj["badge_tier"] = "gold";
        obj["is_gold"] = true;
        obj["success"] = true;
    }

    // Đệ quy quét qua tất cả các thuộc tính bên trong nếu Object có cấu trúc lồng nhau
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === "object" && obj[key] !== null) {
            injectBadge(obj[key]);
        }
    }
}

// Kiểm tra xem URL request có chứa cụm từ "/user/info" hay không
if (url.includes("/user/info")) {
    // Nếu đúng endpoint, trả về trực tiếp response giả lập Premium thành công luôn
    $done({
        response: {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                data: {
                    badge: "gold",
                    badge_tier: "gold",
                    is_gold: true,
                    success: true
                },
                result: {
                    badge: "gold",
                    badge_tier: "gold",
                    is_gold: true,
                    success: true
                }
            })
        }
    });
} else {
    // Nếu là URL khác, lấy body response thực tế từ server trả về
    let body = typeof $response !== "undefined" ? $response["body"] : null;
    if (body) {
        try {
            // Giải mã chuỗi JSON từ server, tiêm Huy hiệu Gold vào rồi đóng gói lại
            let obj = JSON.parse(body);
            injectBadge(obj);
            body = JSON.stringify(obj);
        } catch (e) {}
    }
    $done({ body: body });
}
