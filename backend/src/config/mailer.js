import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const fullName = user.fullName || user.email.split('@')[0];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Xác thực tài khoản E-Shop</h2>
      
      <p>Xin chào <strong>${fullName}</strong>,</p>
      
      <p>Cảm ơn bạn đã đăng ký tài khoản tại E-Shop. Để bảo mật tài khoản và bắt đầu mua sắm, vui lòng xác nhận địa chỉ email của bạn bằng cách nhấp vào nút bên dưới:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Xác thực Email
        </a>
      </div>
      
      <p style="font-size: 0.9em; color: #666;">
        Nếu nút trên không hoạt động, bạn có thể copy và paste đường dẫn sau vào trình duyệt:<br>
        <a href="${verifyUrl}" style="color: #007bff;">${verifyUrl}</a>
      </p>
      
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p style="font-size: 0.8em; color: #999; text-align: center;">
        Nếu bạn không yêu cầu tạo tài khoản này, vui lòng bỏ qua email này.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"E-Shop" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: "Xác nhận địa chỉ email của bạn - E-Shop",
    html: htmlContent,
  });
};

export const sendMagicLink = async (user, link, isNewUser, temporaryPassword = null) => {
  const subject = isNewUser 
    ? "Hoàn tất đăng ký & Thanh toán đơn hàng của bạn" 
    : "Link đăng nhập nhanh để tiếp tục thanh toán";

  let htmlContent = "";

  if (isNewUser) {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Chào mừng bạn đến với E-Shop!</h2>
        <p>Chúng tôi đã tạo một tài khoản cho bạn để bạn có thể theo dõi đơn hàng của mình.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Tài khoản:</strong> ${user.email}</p>
          ${temporaryPassword ? `<p style="margin: 10px 0 0;"><strong>Mật khẩu tạm thời:</strong> ${temporaryPassword}</p>` : ''}
        </div>

        <p>Vui lòng nhấp vào nút bên dưới để <strong>xác thực tài khoản</strong> và <strong>hoàn tất thanh toán</strong> ngay lập tức:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Hoàn tất thanh toán
          </a>
        </div>
        
        <p style="font-size: 0.9em; color: #666;">
          * Sau khi đăng nhập, vui lòng đổi mật khẩu ngay để bảo mật tài khoản.
        </p>
      </div>
    `;
  } else {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Tiếp tục thanh toán</h2>
        <p>Xin chào ${user.fullName || user.email},</p>
        <p>Chúng tôi nhận thấy bạn đang thực hiện thanh toán. Nhấp vào nút bên dưới để đăng nhập nhanh và hoàn tất đơn hàng của bạn (không cần mật khẩu):</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Đăng nhập & Thanh toán
          </a>
        </div>
        
        <p style="font-size: 0.9em; color: #666;">Link này sẽ hết hạn sau 15 phút.</p>
      </div>
    `;
  }

  await transporter.sendMail({
    from: `"E-Shop" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: subject,
    html: htmlContent,
  });
  
  console.log(`Magic Link sent to ${user.email}`);
};

export const sendOrderSuccessEmail = async (user, order) => {
  const ordersUrl = `${process.env.CLIENT_URL}/orders`;
  const fullName = user.fullName || user.email.split('@')[0];

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #28a745; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Đặt Hàng Thành Công!</h1>
        </div>

        <!-- Body -->
        <div style="padding: 30px;">
          <p style="font-size: 16px; color: #333;">Xin chào <strong>${fullName}</strong>,</p>
          
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Cảm ơn bạn đã mua sắm tại E-Shop. Đơn hàng <strong>#${order._id}</strong> của bạn đã được ghi nhận và đang trong quá trình xử lý.
          </p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
            <p style="margin: 0; color: #555;"><strong>Mã đơn hàng:</strong> #${order._id}</p>
            <p style="margin: 10px 0 0; color: #555;"><strong>Tổng thanh toán:</strong> ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.total_price)}</p>
          </div>

          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Bạn có thể xem chi tiết trạng thái đơn hàng và lịch sử mua hàng của mình bằng cách nhấp vào nút bên dưới:
          </p>

          <!-- Button Redirect -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ordersUrl}" style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              Xem Đơn Hàng Của Tôi
            </a>
          </div>

          <p style="font-size: 14px; color: #999; text-align: center;">
            (Nếu nút trên không hoạt động, hãy truy cập vào: <a href="${ordersUrl}" style="color: #007bff;">${ordersUrl}</a>)
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          <p style="margin: 0;">Cảm ơn bạn đã tin tưởng E-Shop.</p>
          <p style="margin: 5px 0 0;">Đây là email tự động, vui lòng không trả lời email này.</p>
        </div>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"E-Shop" <${process.env.FROM_EMAIL}>`,
      to: user.email,
      subject: `[E-Shop] Đặt hàng thành công - Mã đơn #${order._id}`,
      html: htmlContent,
    });
    console.log(`Đã gửi email thông báo đặt hàng thành công cho: ${user.email}`);
  } catch (error) {
    console.error(`Lỗi gửi email đặt hàng thành công:`, error);
  }
};

export const sendResetPasswordEmail = async (user, resetUrl) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
      <p>Xin chào ${user.fullName},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Để đặt lại mật khẩu, hãy nhấp vào nút bên dưới (link có hiệu lực trong 1 giờ):</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Đặt lại mật khẩu
        </a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"E-Shop Support" <${process.env.FROM_EMAIL}>`,
    to: user.email,
    subject: "Đặt lại mật khẩu của bạn - E-Shop",
    html: htmlContent,
  });
};