#!/usr/bin/env python
import os
import django
import random
from django.utils.text import slugify

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_project.settings')
django.setup()

from shop.models import Category, Product

def create_sample_data():
    """Create sample categories and products for the website"""
    print("Creating sample data for KLI Group website...")
    
    # Create categories
    categories = [
        {
            'name': 'Оборудование для откачки',
            'slug': 'equipment-pumping',
            'products': [
                {
                    'name': 'Мотопомпа Varisco J 70',
                    'description': 'Мотопомпа Varisco J 70 - высококачественное оборудование для откачки воды. Идеально подходит для строительных площадок и промышленных объектов. Обеспечивает быструю и эффективную откачку воды с минимальными затратами энергии.',
                    'price': 560000,
                    'image': 'products/motopump.jpg'
                },
                {
                    'name': 'Насос DAB K 36/200 T',
                    'description': 'Насос DAB K 36/200 T предназначен для перекачивания чистой воды. Компактный размер и высокая производительность делают его отличным решением для водопонижения на объектах любой сложности.',
                    'price': 185000,
                    'image': 'products/pump-dab.jpg'
                },
                {
                    'name': 'Установка иглофильтровая ЭКВИТАЛС ЛИУ-6',
                    'description': 'Иглофильтровая установка ЭКВИТАЛС ЛИУ-6 применяется для глубинного водопонижения грунтовых вод. Комплект включает насосную станцию и 50 иглофильтров. Обеспечивает понижение уровня грунтовых вод до 6 метров.',
                    'price': 1250000,
                    'image': 'products/needlefilter.jpg'
                },
            ]
        },
        {
            'name': 'Комплектующие',
            'slug': 'components',
            'products': [
                {
                    'name': 'Иглофильтр ИГЛ-62',
                    'description': 'Иглофильтр ИГЛ-62 используется для оборудования иглофильтровых установок. Изготовлен из высококачественной стали с перфорацией для фильтрации воды. Длина 6 метров, диаметр 42 мм.',
                    'price': 12500,
                    'image': 'products/filter-needle.jpg'
                },
                {
                    'name': 'Соединение шланговое 50 мм',
                    'description': 'Шланговое соединение диаметром 50 мм для соединения иглофильтров с насосной станцией. Обеспечивает герметичное соединение и выдерживает давление до 10 бар.',
                    'price': 2800,
                    'image': 'products/hose-connection.jpg'
                },
                {
                    'name': 'Шланг напорный 50 мм (30 м)',
                    'description': 'Напорный шланг диаметром 50 мм, длина 30 метров. Используется для соединения иглофильтров с насосной станцией. Выдерживает давление до 16 бар.',
                    'price': 15600,
                    'image': 'products/pressure-hose.jpg'
                },
            ]
        },
        {
            'name': 'Услуги водопонижения',
            'slug': 'dewatering-services',
            'products': [
                {
                    'name': 'Водопонижение иглофильтрами (до 100 м²)',
                    'description': 'Услуга водопонижения грунтовых вод с использованием иглофильтров на площади до 100 м². Включает монтаж/демонтаж оборудования, обслуживание системы на протяжении всего периода работ. Стоимость указана за 1 месяц работы.',
                    'price': 450000,
                    'image': 'products/dewatering-service.jpg'
                },
                {
                    'name': 'Проектирование систем водопонижения',
                    'description': 'Разработка проекта системы водопонижения для вашего объекта. Включает расчет необходимого оборудования, схему размещения и технические рекомендации. Стоимость зависит от площади объекта и геологических условий.',
                    'price': 150000,
                    'image': 'products/dewatering-design.jpg'
                },
            ]
        },
        {
            'name': 'Асфальтирование и благоустройство',
            'slug': 'asphalting-improvement',
            'products': [
                {
                    'name': 'Асфальтирование территории (за м²)',
                    'description': 'Услуга по асфальтированию территории. Включает подготовку основания, укладку асфальта и уплотнение. Гарантия на выполненные работы 2 года. Стоимость указана за 1 м².',
                    'price': 3500,
                    'image': 'products/asphalting.jpg'
                },
                {
                    'name': 'Установка бордюров (за погонный метр)',
                    'description': 'Установка бордюрного камня. Включает подготовку основания, установку бордюра и заделку швов. Стоимость указана за 1 погонный метр.',
                    'price': 2800,
                    'image': 'products/curbs.jpg'
                },
                {
                    'name': 'Благоустройство территории (комплекс)',
                    'description': 'Комплексное благоустройство территории, включающее планировку участка, установку бордюров, асфальтирование, озеленение. Индивидуальный подход к каждому проекту. Стоимость зависит от площади и особенностей территории.',
                    'price': 780000,
                    'image': 'products/landscaping.jpg'
                },
            ]
        },
    ]
    
    # Create categories and products
    for category_data in categories:
        # Create category
        category, created = Category.objects.get_or_create(
            name=category_data['name'],
            slug=category_data['slug']
        )
        
        if created:
            print(f"Created category: {category.name}")
        
        # Create products for this category
        for product_data in category_data['products']:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults={
                    'slug': slugify(product_data['name']),
                    'category': category,
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'image': product_data['image']
                }
            )
            
            if created:
                print(f"  Created product: {product.name}")
    
    print("Sample data creation completed!")

if __name__ == '__main__':
    create_sample_data()