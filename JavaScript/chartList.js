//-- variables of charts and list ---->
var key = 1;                //-- Category Death
var countryLabel=[];        //-- label of X axis 
var CountryDeath = [];      //-- label of y axis
var coordinate=[];          //-- country coordinates 
var color;                  //-- Background color of chart
var updata = false;         //-- for check updata chart (when clicked chart)
var test = false;           //-- for check updata chart (when clicked list)
var listFilter = false;     //-- for check mood list
var queryChart =false;      //-- for check mood chart


//--------------------------------- add Country to left List ---------------------------->
// list();
function list() {
    var listGroup =[]
    for (let index = 0; index < covid.length; index++) {
        listGroup.push(`<div class="row" onclick="filterList(${covid[index].id})">
            <span class="total">${((covid[index].confirmed/totalConfirmed)*100).toFixed(5)}%</span><span class="country"> ${covid[index].country }</span>
            <div class="death"> deaths : ${((covid[index].deaths/totalDeaths)*100).toFixed(5)}% </div>
            <div class="Recovered"> Recovered : ${((covid[index].recovered/totalrRecovered)*100).toFixed(5)}% </div>
        </div >`)
    }
    document.getElementById("leftUp").innerHTML=listGroup
}

//-----------------------------------        doughnut chart       ---------------------------------->
// DoughnutChart(totalConfirmed,totalDeaths,totalrRecovered)
var myChart;
function DoughnutChart(Confirmed,Deaths,Recovered) {
    var ctx = document.getElementById('myChart');
 myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Confirmed', 'Deaths', 'Recovered'],
        datasets: [{
            label: 'Covid-19',
            data: [Confirmed,Deaths,Recovered],
            backgroundColor: [
                'rgba(54, 162, 235, .5)',
                'rgba(179, 00, 00, 0.6)',
                'rgba(169, 255, 142, .5)',
            ],
            borderColor: [
                'rgba(54, 162, 235, .5)',
                'rgba(179, 00, 00, 0.6)',
                'rgba(169, 255, 142, .5)',
                ,
            ],
            borderWidth: 1
        }]
    },

});
}


//-----------------------------------        bar chart       ---------------------------------->

var myChart2
function draw(labelCode,ndeath,co){
    updata=true
    let st = document.getElementById("myChart2")
    st.style.display ='inline-block'
    var ctx = document.getElementById('myChart2').getContext('2d');
    myChart2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:labelCode,
            datasets: [{ 
                label: 'Covid',
                data: ndeath,
                backgroundColor: co,
                borderColor: co,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    
                }
            },
        }
    });
}


//--------------------------------------- classfication country ---------------------------->
function loop(keyNumber) {
    countryLabel = []
    CountryDeath=[]
    coordinate=[]

    for (let index = 0; index < covid.length; index++) {
        // ----- Countries with Very high deaths
        if (keyNumber == 1 && covid[index].deaths >7071) {
                countryLabel.push(covid[index].country_code)
                CountryDeath.push(covid[index].deaths)
                coordinate.push(covid[index].coordinates)
        }

        // ----- Countries with high deaths
        else if (keyNumber == 2 && covid[index].deaths <7071 && covid[index].deaths >1160) {
            countryLabel.push(covid[index].country_code)
            CountryDeath.push(covid[index].deaths)
            coordinate.push(covid[index].coordinates)
        }
        // ----- Countries with intermediate deaths
        else if (keyNumber == 3 && covid[index].deaths <1160 && covid[index].deaths >121) {
            countryLabel.push(covid[index].country_code)
            CountryDeath.push(covid[index].deaths)
            coordinate.push(covid[index].coordinates)
        }
        // ----- Countries with low deaths
        else if (keyNumber == 4 && covid[index].deaths <121 && covid[index].deaths >6) {
            countryLabel.push(covid[index].country_code)
            CountryDeath.push(covid[index].deaths)
            coordinate.push(covid[index].coordinates)
        }
        // ----- Countries with Very low deaths
        else if (keyNumber == 5 && covid[index].deaths <6 ) {
            countryLabel.push(covid[index].country_code)
            CountryDeath.push(covid[index].deaths)
            coordinate.push(covid[index].coordinates)
        }
        
    } 

    if (!test) {
        updateChart(countryLabel,CountryDeath,color)
    }
    
};


//-------------------------------- switch classfication ------------------------------------->
function switchClass() {
    let CategoryList = document.getElementById("CategoryList")
    if (CategoryList.value==1) {veryHigh()};
    if (CategoryList.value==2) {High()};
    if (CategoryList.value==3) {intermediate()};
    if (CategoryList.value==4) {Low()};
    if (CategoryList.value==5) {veryLow()};
    list()
    hidePopup()
    mymap.flyTo([31,30],3);
}
// veryHigh()
function veryHigh() {
    key = 1
    document.getElementById("CategoryList").value=key 
    color='rgba(179, 00, 00, 0.8)'
    loop(key) 
};
function High() {
    key = 2 
    document.getElementById("CategoryList").value=key
    color ='rgba(255, 00, 00, 0.8)'
    loop(key) 
}
function intermediate() {
    key = 3
    document.getElementById("CategoryList").value=key
    color = 'rgba(255, 77, 77, 0.8)'
    loop(key)  
}
function Low() {
    key = 4 
    document.getElementById("CategoryList").value=key
    color ='rgba(255, 121, 121, 0.8)'
    loop(key)  
}
function veryLow() {
    key = 5 
    document.getElementById("CategoryList").value=key
    color ='rgba(255, 183, 183, 0.8)'
    loop(key)  
}


//-------------------------------- Update and draw chart ------------------------------------->
function updateChart(a,b,c){
    if (updata) {
        myChart2.data.labels=a
        myChart2.data.datasets[0].data=b
        myChart2.data.datasets[0].backgroundColor=c
        myChart2.data.datasets[0].borderColor=c
        myChart2.update();        
    }else{
        draw(a,b,c)
    }
}

//-------------------------------- Update Doughnut ------------------------------------->
function updateDoughnut(a,b,c){
    myChart.data.datasets[0].data=[a,b,c]
    myChart.update();
}

//--------------------------------   id clicked column    --------------------------------------->
function getid(evt){
    let act = myChart2.getElementsAtEvent(evt);
    if(act.length){
        let id =act[0]["_index"]
        queryChart = true
        filterchart(id,null)
        
    }else{
        queryChart = false;
        switchClass();
        list();
        mymap.flyTo([31,30],3);
        hidePopup()
        updateDoughnut(totalConfirmed,totalDeaths,totalrRecovered)
    }
}


//------------------------------- filter selected country  ------------------------------------>
function filterchart(params,coordin) {
    let filter_color =[]
    let zoommap =[]
    let id;
    for (let index = 0; index < CountryDeath.length; index++) {
        if (index ==params || coordinate[index]==coordin) {
            filter_color.push('rgba(255, 56, 50, 0.8)')
            zoommap = coordinate[index]
        }
        else{
        filter_color.push('rgba(255, 56, 50, 0.1)')
        }
    }
    for (let index = 0; index < covid.length; index++) {
        if (covid[index].coordinates==zoommap) {
            id = covid[index].id
        }
        
    }

    updateChart(countryLabel,CountryDeath,filter_color)
    mymap.flyTo(zoommap,7)
    if (queryChart) {
      filterList(id)  
    }
    
    
}


//------------------------------- Switch mood between draw - filter of list  ------------------------------------>
function filterList(index) {
    test=false  
    let list =`<div class="row" onclick="filterList(${covid[index].id})">
    <span class="total">${((covid[index].confirmed/totalConfirmed)*100).toFixed(5)}%</span><span class="country"> ${covid[index].country }</span>
    <div class="death"> deaths : ${((covid[index].deaths/totalDeaths)*100).toFixed(5)}% </div>
    <div class="Recovered"> Recovered : ${((covid[index].recovered/totalrRecovered)*100).toFixed(5)}% </div>
    </div >`
    document.getElementById("leftUp").innerHTML=list
    if (!queryChart) {
        if (covid[index].deaths >7071) {veryHigh()}
        else if (covid[index].deaths <7071 && covid[index].deaths >1160) {High()}
        else if (covid[index].deaths <1160 && covid[index].deaths >121) {intermediate()}
        else if (covid[index].deaths <121 && covid[index].deaths >6) {Low()}
        else if (covid[index].deaths <6 ) {veryLow()};
        filterchart(null,covid[index].coordinates) 
    }
    updateDoughnut(covid[index].confirmed,covid[index].deaths,covid[index].recovered)
    showPopup(index,covid[index].coordinates)
}


//------------------------------- Switch mood between draw - filter of list  ------------------------------------>
function switchlist() {
    // queryChart = false 
    if (listFilter) {list(); switchClass(); mymap.flyTo([31,30],3); 
        listFilter=false; queryChart = false; hidePopup(); 
        updateDoughnut(totalConfirmed,totalDeaths,totalrRecovered)}
    else{listFilter=true; }
}

