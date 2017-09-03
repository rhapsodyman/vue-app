export default [{
categoryName: 'Basic',
   filters: [
     {
       filterLabel: 'Security Type',
       type: 'MultiSelect',
       bindName: 'SECURITY_TYPE',
       options: ['STOCK', 'ETF', 'BOND', 'OPTION']

     },
     {
       filterLabel: 'Is Shortable',
       bindName: 'IS_SHORTABLE',
       type: 'Switch'
     }
   ]
   },
   {
     categoryName: 'Other Category',
     filters: [{
         filterLabel: 'Listed on Market',
         bindName: 'LISTED_ON',
         type: 'Select',
         options: ['ARCA', 'NASDAQ']
       },
       {
           filterLabel: 'Min price',
           bindName: 'MIN_PRICE',
           type: 'Input'
         }
     ]
   }
 ];
