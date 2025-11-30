import React from 'react';

const ProductSections = () => {
    const collections = [
    {
      title: 'Giày đá bóng',
      description:
        'Đa dạng mẫu mã cho sân cỏ nhân tạo và tự nhiên. Êm ái, bám sân tốt và hỗ trợ bứt tốc tối đa.',
      buttonText: 'Mua ngay',
      link: '/categories/giay-da-bong',
    },
    {
      title: 'Áo đá bóng',
      description:
        'Chất liệu vải mè thái thoáng khí, thấm hút mồ hôi cực tốt. Thiết kế hiện đại, bền màu và chuẩn form.',
      buttonText: 'Mua ngay',
      link: '/categories/ao-dau',
    },
    {
      title: 'Các sản phẩm khác',
      description:
        'Trang bị tận răng với tất cả những gì bạn cần để có một trận đấu thật cháy.',
      buttonText: 'Mua ngay',
      link: '/products',
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
                href={collection.link}
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
