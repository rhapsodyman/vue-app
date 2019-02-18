export default {
	legs: [  
	{ 
		name: "Leg 1",
		index: 0,
		sections: [
			{
				"categoryName": "Basic",
				"filters": [
					{
						"filterLabel": "Security type Security ",
						"type": "Select",
						"bindName": "SECURITY_TYPE",
						"options": ["STOCK", "ETF", "OPTION"],
						"isLegFilter": true
					},
					{
						"filterLabel": "Some date",
						"type": "Date",
						"bindName": "SOME_DATE",
						"isLegFilter": true
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
						"options": ["ARCA", "NASDAQ"],
						"isLegFilter": true
					},
					{
						"filterLabel": "Min price",
						"bindName": "MIN_PRICE",
						"type": "Input",
						"isLegFilter": true
					},
					{
						"filterLabel": "Is Shortable",
						"bindName": "IS_SHORTABLE",
						"type": "Switch",
						"isLegFilter": true
					}
				]
			},
			{
				"categoryName": "Stock Only",
				"filters": [
					{
						"filterLabel": "Stock filter 1",
						"bindName": "STOCK_ONLY_1",
						"type": "Input",
						"supportedFor":  ["STOCK", "ETF"],
						"isLegFilter": true
					},
					{
						"filterLabel": "Stock filter 2",
						"bindName": "STOCK_ONLY_2",
						"type": "Input",
						"supportedFor":  ["STOCK", "ETF"],
						"isLegFilter": true
					}
				]
			},
			{
				"categoryName": "Option only",
				"filters": [
					{
						"filterLabel": "Options only 2",
						"bindName": "OPTIONS_ONLY_1",
						"type": "Input",
						"supportedFor":  ["OPTION"],
						"isLegFilter": true
					},
					{
						"filterLabel": "Options filter 2",
						"bindName": "OPTIONS_ONLY_2",
						"type": "Input",
						"supportedFor":  ["OPTION"],
						"isLegFilter": true
					}
				]
			}
	]
}
],


commonParams: [  
	{ 
		name: "Common Params",
		sections: [
			{
				"categoryName": "Und symbol",
				"filters": [
					{
						"filterLabel": "Underlying ",
						"type": "Select",
						"bindName": "UND_SYMBOL",
						"options": ["same", "different"],
						"isLegFilter": false
					},
					{
						"filterLabel": "Special ",
						"type": "Input",
						"bindName": "SPECIAL_CASE",
						"isLegFilter": false
					}
				]
			}
		]
	}
]
}


