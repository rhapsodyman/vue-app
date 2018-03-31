export default [
	{
		"categoryName": "Basic",
		"filters": [
			{
				"filterLabel": "Security type Security type some long name and more\n symbols adn andrei malai is the best",
				"type": "Select",
				"bindName": "SECURITY_TYPE",
				"options": ["STOCK", "ETF", "OPTION"]
			}
		]
	},
	{
		"categoryName": "Other Category",
		"filters": [
			{
				"filterLabel": "Listed on Market",
				"bindName": "LISTED_ON",
				"type": "Select",
				"options": ["ARCA", "NASDAQ"]
			},
			{
				"filterLabel": "Min price",
				"bindName": "MIN_PRICE",
				"type": "Input"
			},
			{
				"filterLabel": "Is Shortable",
				"bindName": "IS_SHORTABLE",
				"type": "Switch"
			}
		]
	},
	{
		"categoryName": "Stock Only",
		"aplicableFor" : ["STOCK", "ETF"],
		"filters": [
			{
				"filterLabel": "stock only1",
				"bindName": "STOCK_ONLY_1",
				"type": "Input"
			},
			{
				"filterLabel": "stock only2",
				"bindName": "STOCK_ONLY_2",
				"type": "Input"
			}
		]
	},
	{
		"categoryName": "Options only",
		"aplicableFor" : ["OPTION"],
		"filters": [
			{
				"filterLabel": "Options only1",
				"bindName": "OPTIONS_ONLY_1",
				"type": "Input"
			},
			{
				"filterLabel": "Options only2",
				"bindName": "OPTIONS_ONLY_2",
				"type": "Input"
			}
		]
	}
]
