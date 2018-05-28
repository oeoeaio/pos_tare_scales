# -*- coding: utf-8 -*-
{
    'name': 'POS Tare Scales',
    'version': '1.0.1',
    'category': 'Point Of Sale',
    'author': 'Rob Harrington',
    'sequence': 10,
    'summary': 'Add TARE button to POS scales screen',
    'description': "",
    'depends': ['point_of_sale'],
    'data': [
        'views/assets.xml',
    ],
    'qweb': [
        'static/src/xml/templates.xml'
    ],
    'images': [],
    'installable': True,
    'application': False,
    'license': 'LGPL-3'
}
