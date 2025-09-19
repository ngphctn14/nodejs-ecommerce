import React from 'react';

const ProductSections = () => {
  const collections = [
    {
      title: 'Giày sân cỏ nhân tạo',
      description:
        'Thiết kế chuyên cho sân cỏ nhân tạo, độ bám tốt, chất liệu bền bỉ, khả năng hỗ trợ di chuyển linh hoạt.',
      buttonText: 'Mua ngay',
      link: 'giay-san-co-nhan-tao',
    },
    {
      title: 'Giày cỏ tự nhiên',
      description:
        'Dành cho sân cỏ tự nhiên với đinh giày chắc chắn, tăng cường độ ma sát và tối ưu khả năng kiểm soát bóng.',
      buttonText: 'Mua ngay',
      link: 'giay-co-tu-nhien',
    },
    {
      title: 'Các sản phẩm khác',
      description:
        'Khám phá thêm nhiều phụ kiện và sản phẩm thể thao khác, phù hợp cho nhu cầu tập luyện và thi đấu.',
      buttonText: 'Mua ngay',
      link: 'khac',
    },
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <div key={index} className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {collection.title}
              </h3>
              <p className="text-gray-700 mb-4">{collection.description}</p>

              <a
                href={"/products/" + collection.link}
                className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors duration-200"
              >
                {collection.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSections;
