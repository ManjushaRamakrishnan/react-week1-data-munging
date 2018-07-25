const fs = require('fs');
const readline = require('readline');
const csvData = fs.createReadStream('./input/Crimes_-_2001_to_present.csv');

const rl = readline.createInterface({
    input: csvData
});

let finalData = {};
let isHeader = true;
let header = [];
let year, primaryType, description;
rl.on('line', (line) =>{
    if(isHeader){
        isHeader = false;
        header = line.split(',');
        year = header.indexOf('Year');
        primaryType = header.indexOf('Primary Type');
        description = header.indexOf('Description');
        arrest = header.indexOf('Arrest');
        
    }
    else{
    const row = line.split(',');

     //filteration
     let obj = {};
     //console.log(row[primaryType], row[year]);
     if((row[primaryType] === 'ASSAULT') && (row[year] >= 2001 && row[year] <= 2018)){
       
        if(row[arrest] == 'true'){
           // console.log('arrest', row[arrest])
           if(finalData[row[year]] ){
            
             finalData[row[year]]['arrest']++;
           }
           else{
            obj['arrest'] = 1;
            obj['notArrest'] = 0;
            obj['theftOver500'] = 0;
            obj['theftUnder500'] = 0;
            finalData[row[year]] = obj;
           
           }
           
        }
        else {
            //console.log('if not arrest')
            if(finalData[row[year]] ){
                finalData[row[year]]['notArrest']++;
               }
               else{
                obj['arrest'] = 0;
                obj['notArrest'] = 1;
                obj['theftOver500'] = 0;
                obj['theftUnder500'] = 0;
                finalData[row[year]] = obj;
               
               }
        }
     }
     if((row[primaryType] === 'THEFT') && (row[year] >= 2001 && row[year] <= 2018)){
        // console.log('if true')
        if(row[description] === 'OVER $500'){
            //console.log('if OVER $500')
           if(finalData[row[year]] ){
            finalData[row[year]]['theftOver500']++;
           }
           else{
            obj['arrest'] = 0;
            obj['notArrest'] = 0;
            obj['theftOver500'] = 1;
            obj['theftUnder500'] = 0;
            finalData[row[year]] = obj;
           
           }
           
        }
        else if (row[description] === '$500 AND UNDER'){
            //console.log('if $500 AND UNDER')
            if(finalData[row[year]]){
                finalData[row[year]]['theftUnder500']++;
               }
               else{
                obj['arrest'] = 0;
                obj['notArrest'] = 0;
                obj['theftOver500'] = 0;
                obj['theftUnder500'] = 1;
                finalData[row[year]] = obj;
               }
        }
        
    /**** This was tried for adding arrested assault case *****/   
      /*  if(row[arrest]){
            if(finalData[row[year]]){
                finalData[row[year]]['arrested']++;
            }
            else{
                obj['arrested'] = 1;
                obj['notArrested'] = 0;
                //finalData[row[year]] = obj;
            }
        }
        else{
            if(finalData[row[year]]){
                finalData[row[year]]['notArrested']++;
            }
            else{
                obj['arrested'] = 0;
                obj['notArrested'] = 1;
                //finalData[row[year]] = obj;
            }
        }
        finalData[row[year]] = obj;
        */
      // console.log("object::"+JSON.stringify(obj));
     }
     
     
    }
    
   // rl.pause();
});

rl.on('close', () =>{
    finalOutput = [];
    for (var key in finalData) {
       const col = {'year': key, ...finalData[key]};
       finalOutput.push(col);
    }
    fs.writeFile('output/theft.json', JSON.stringify(finalOutput), (err) =>{
      if(err){
        console.log("ERR::", err)
      } 
      console.log("file has been written") 
    });
})