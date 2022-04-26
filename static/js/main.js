var alldata = {};
var newsdata = {};

function updateProgress(){
	var perc = 0;

	document.getElementById("update-progress").innerHTML = `
		<h1 class="progressbar-info">Update Progress: ${perc}%</h1>
		<div id="progressbar">
			<div id="progressbar-progress"></div>							
		</div>
	`
	document.getElementById("progressbar-progress").style.backgroundSize = `${perc}% 60%`;
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

var checked = false
function translatePage(){
	var curlang = navigator.language.substring(0, 2)
	if (!checked){
		$.get(`../static/localization/language-${curlang}.json`)
		.done(function() { 
			$("[data-localize]").localize("../static/localization/language", {language: curlang});
		})
		.fail(function() { 
			checked = true
			$("[data-localize]").localize("../static/localization/language", {language: "en"});
		})
	}
}

var BigDay = new Date();
while (BigDay.getDay() < 3 || BigDay.getDay() > 3 & BigDay.getDay() < 6 || BigDay.getDay() > 6 & BigDay.getDay() < 7) {
	BigDay.setDate(BigDay.getDate()+1)
}
BigDay.setHours(18)
BigDay.setMinutes(0)	
BigDay.setSeconds(0)

function updateTime() {
	var names = {days:      {1:"день", 2:"дня", 3: "дней"},
				 hours:     {1:"час", 2: "часа", 3: "часов"},
				 minutes:   {1:"минута", 2: "минуты", 3: "минут"},
				 seconds:   {1:"секунда", 2: "секунды", 3: "секунд"},
	};
	var day_name = names['days'][3];
	var hur_name = names['hours'][3];
	var min_name = names['minutes'][3];
	var sec_name = names['seconds'][3];
	var fin_line = ""
	var today = new Date();
	
	var timeLeft = (BigDay.getTime() - today.getTime());
 
	var e_daysLeft = timeLeft / 86400000;
	var daysLeft = Math.floor(e_daysLeft);
 
	var slice_day = String(daysLeft).slice(-1);
	if(parseInt(slice_day) == 1 && (parseInt(daysLeft) < 10 || parseInt(daysLeft) > 20)){
		day_name = names['days'][1];
	}else if((parseInt(slice_day) == 2 || parseInt(slice_day) == 3 || parseInt(slice_day) == 4) && (parseInt(daysLeft) < 10 || parseInt(daysLeft) > 20)){
		day_name = names['days'][2];
	}else{
		day_name = names['days'][3];
	}
 
	var e_hrsLeft = (e_daysLeft - daysLeft)*24;
	var hrsLeft = Math.floor(e_hrsLeft);
	var slice_hours = String(hrsLeft).slice(-1);
	if(parseInt(slice_hours) == 1 && (parseInt(hrsLeft) < 10 || parseInt(hrsLeft) > 20)){
		hur_name = names['hours'][1];
	}else if((parseInt(slice_hours) == 2 || parseInt(slice_hours) == 3 || parseInt(slice_hours) == 4)  && (parseInt(hrsLeft) < 10 || parseInt(hrsLeft) > 20)){
		hur_name = names['hours'][2];
	}else{
		hur_name = names['hours'][3];
	}
 
	var e_minsLeft = (e_hrsLeft - hrsLeft)*60;
	var minsLeft = Math.floor(e_minsLeft);
	var slice_min = String(minsLeft).slice(-1);
	if(parseInt(slice_min) == 1 && (parseInt(minsLeft) < 10 || parseInt(minsLeft) > 20)){
		min_name = names['minutes'][1];
	}else if((parseInt(slice_min) == 2 || parseInt(slice_min) == 3 || parseInt(slice_min) == 4) && (parseInt(minsLeft) < 10 || parseInt(minsLeft) > 20)){
		min_name = names['minutes'][2];
	}else{
		min_name = names['minutes'][3];
	}
 
	var seksLeft = Math.floor((e_minsLeft - minsLeft)*60);
	var slice_sec = String(seksLeft).slice(-1);
	if(parseInt(slice_sec) == 1 && (parseInt(seksLeft) < 10 || parseInt(seksLeft) > 20)){
		sec_name = names['seconds'][1];
	}else if((parseInt(slice_sec) == 2 || parseInt(slice_sec) == 3 || parseInt(slice_sec) == 4) && (parseInt(seksLeft) < 10 || parseInt(seksLeft) > 20)){
		sec_name = names['seconds'][2];
	}else{
		sec_name = names['seconds'][3];
	}
 
	if (daysLeft !== 0) {
		fin_line = fin_line+" "+daysLeft+" "+day_name
	}
 
	if (hrsLeft !== 0) {
		fin_line = fin_line+" "+hrsLeft+" "+hur_name
	}
 
	if (minsLeft !== 0) {
		fin_line = fin_line+" "+minsLeft+" "+min_name
	}
 
	if (seksLeft !== 0) {
		fin_line = fin_line+" "+seksLeft+" "+sec_name
	}

	if (BigDay.getTime() > today.getTime() ){
		document.getElementById("time").innerHTML = fin_line;
	}else{
		clearInterval(x)
		document.getElementById("time").innerHTML = `<p data-localize="main.gamesstarted">Игры начались!</p>`;
	}
	translatePage()
}

function countdown(){	
	var x = setInterval(updateTime, 1000);
	updateTime()
}

function populatePlayersData(isall){
	var num = 0

	function SortByRank() {    
		return function(a, b) {  
			if (a[1].statistics.rank > b[1].statistics.rank) {    
				return -1;    
			} else if (a[1].statistics.rank < b[1].statistics.rank) {    
				return 1;    
			}    
			return 0;    
		}    
	}    

	function SortByName() {  
		return function(a, b) {  
			if (a[1].name < b[1].name) {    
				return -1;    
			} else if (a[1].name > b[1].name) {    
				return 1;    
			}    
			return 0;    
		}      
	}    
	const map = new Map(Object.entries(alldata))

	if (isall){
		var mapsorted = new Map([...map.entries()].sort(SortByName()));
	}else{
		var mapsorted = new Map([...map.entries()].sort(SortByRank()));
	}

	for (const [key, value] of mapsorted) {
		console.log(value)
		if (key!=="") {
			num = num + 1

			if (!isall){
				if (num > 10){
					return
				}
			}
			document.getElementById("data").innerHTML += `
				<ul  onClick="location='/profiles/${key}'" class="player-container">
					<li>${num}</li>
					<li>${value.name}</li>
					<li>${value.statistics.rank}</li>
				</ul>
			`
		}
	}
}

function getPlayersData(isall) {
    $.ajax({
        type: 'GET',
        url: "../static/data/playersdata.json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                alldata = data;
				populatePlayersData(isall);
            }
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
			populatePlayersData(isall);
        }
    });
}
var cur_page = 0
function populateNewsData(num){
	if (cur_page==0){
		cur_page = Object.keys(newsdata).length
	}
	
	if (num!=null){
		if(cur_page!=1 & num<0){
			cur_page = cur_page + num
		} else if(cur_page!=Object.keys(newsdata).length & num>0){
			cur_page = cur_page + num
		}else{
			return
		}
	}

	document.getElementById("newsheader").innerHTML = `<p data-localize="news.posts.${cur_page}.title">${newsdata[cur_page].title}</p>`
	if (newsdata[cur_page].image){
		document.getElementById("newsimage").innerHTML = `
			<img class="divider-news-img-top" id ="newsimagebox_divtop" src="../static/images/timer_divider_top.png">
			<div class="news-img-box" id ="newsimagebox">
				<img id ="newsimage" class="newsimage" src="${newsdata[cur_page].image}"></img>
			</div>
			<img class="divider-news-img-bottom" id ="newsimagebox_divbot" src="../static/images/timer_divider_bottom.png">
		`
	} else {
		document.getElementById("newsimage").innerHTML = ``
		if (document.getElementById("newsimagebox")){
			document.getElementById("newsimagebox").remove()
		}
		if (document.getElementById("newsimagebox_divtop")){
			document.getElementById("newsimagebox_divtop").remove()
		}
		if (document.getElementById("newsimagebox_divbot")){
			document.getElementById("newsimagebox_divbot").remove()
		}
	}

	if (newsdata[cur_page].desc){
		document.getElementById("newsdesc").innerHTML = `<p	data-localize="news.posts.${cur_page}.desc">${newsdata[cur_page].desc}</p>`
	} else {
		document.getElementById("newsdesc").innerHTML = ``
	}

	if (newsdata[cur_page].addings){
		document.getElementById("newsaddings").innerHTML = `
			<div class="news-addit-info">
				<img class = "news-pointers" src="../static/images/added.png"></img>
				<p data-localize="news.added">What's Added:</p>
			</div>
		`
		document.getElementById("newsaddings").innerHTML += `<ul id="newsaddingsdesc"></ul>`
		for (var i = 0; i < newsdata[cur_page].addings.length; i++) {
			document.getElementById("newsaddingsdesc").innerHTML += `
				<li class="news-small-info" data-localize="news.posts.${cur_page}.addings.${i}">${newsdata[cur_page].addings[i]}</li>
			`
		}
	} else {
		document.getElementById("newsaddings").innerHTML = ``
		if (document.getElementById("newsaddingsdesc")){
			document.getElementById("newsaddingsdesc").remove()
		}
	}

	if (newsdata[cur_page].improvements){
		document.getElementById("newsimprovements").innerHTML = `
			<div class="news-addit-info">
				<img class = "news-pointers" src="../static/images/improved.png"></img>
				<p data-localize="news.improved">What's Improved:</p>
			</div>
		`
		document.getElementById("newsimprovements").innerHTML += `<ul id="newsimprovementsdesc"></ul>`
		for (var i = 0; i < newsdata[cur_page].improvements.length; i++) {
			document.getElementById("newsimprovementsdesc").innerHTML += `
				<li class="news-small-info" data-localize="news.posts.${cur_page}.improvements.${i}">${newsdata[cur_page].improvements[i]}</li>
			` 
		}
	} else {
		document.getElementById("newsimprovements").innerHTML = ``
		if (document.getElementById("newsimprovementsdesc")){
			document.getElementById("newsimprovementsdesc").remove()
		}
	}

	if (newsdata[cur_page].removes){
		document.getElementById("newsremoved").innerHTML = `
			<div class="news-addit-info">
				<img class = "news-pointers" src="../static/images/removed.png"></img>
				<p data-localize="news.removed">What's Removed:</p>
			</div>
		`
		document.getElementById("newsremoved").innerHTML += `<ul id="newsremoveddesc"></ul>`
		for (var i = 0; i < newsdata[cur_page].removes.length; i++) {
			document.getElementById("newsremoveddesc").innerHTML += `
				<li class="news-small-info" data-localize="news.posts.${cur_page}.removes.${i}">${newsdata[cur_page].removes[i]}</li>
			`
		}
	} else {
		document.getElementById("newsremoved").innerHTML = ``
		if (document.getElementById("newsremoveddesc")){
			document.getElementById("newsremoveddesc").remove()
		}
	}

	if (newsdata[cur_page].bugfixes){
		document.getElementById("newsbugfixes").innerHTML = `
			<div class="news-addit-info">
				<img class = "news-pointers" src="../static/images/fixed.png"></img>
				<p data-localize="news.fixed">What's Fixed:</p>
			</div>
		`
		document.getElementById("newsbugfixes").innerHTML += `<ul id="newsbugfixesdesc"></ul>`
		for (var i = 0; i < newsdata[cur_page].bugfixes.length; i++) {
			document.getElementById("newsbugfixesdesc").innerHTML += `
				<li class="news-small-info" data-localize="news.posts.${cur_page}.bugfixes.${i}">${newsdata[cur_page].bugfixes[i]}</li>
			`
		}
	} else {
		document.getElementById("newsbugfixes").innerHTML = ``
		if (document.getElementById("newsbugfixesdesc")){
			document.getElementById("newsbugfixesdesc").remove()
		}
	}

	if (newsdata[cur_page].postdesc){
		document.getElementById("newspostdesc").innerHTML = `<p	data-localize="news.posts.${cur_page}.postdesc">${newsdata[cur_page].postdesc}</p>`
	} else {
		document.getElementById("newspostdesc").innerHTML = ``
	}
	translatePage();
}

function getNewsData() {
    $.ajax({
        type: 'GET',
        url: "../static/data/newsdata.json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                newsdata = data;
				populateNewsData();
            }
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
			populateNewsData();
		}
    });
}

var devsdata = {};

function makeHoverable(num){
	document.getElementById("devicon"+num).addEventListener("mouseover", OnHover);
	document.getElementById("devicon"+num).addEventListener("mouseout", OnUnHover);

	function OnHover() {
		document.getElementById("devicon"+num).style.backgroundImage = `url(${devsdata[(num)].image}-hover.png)`;
	}
	function OnUnHover() {
		document.getElementById("devicon"+num).style.backgroundImage = `url(${devsdata[(num)].image}.png)`;
	}
}

function populateDevInfo(id){
	document.getElementById("devname").innerHTML = `
		${devsdata[id].name}
	`
	document.getElementById("devdesc").innerHTML = `
		${devsdata[id].desc}
	`
	document.getElementById("devlinks").innerHTML = ""
	const map = new Map(Object.entries(devsdata[id].links))

	for (const [key, value] of map) {
		document.getElementById("devlinks").innerHTML += `
			<a href="${value}" id = "devlinks${key}" class = "devlink"></a>
		`
		document.getElementById("devlinks"+key).style.content = `url("../static/images/${key}.png")`;

	}
}

function populateDevsData(){
	for (var i = 1; i < Object.keys(devsdata).length+1; i++) {
		document.getElementById("devsicons").innerHTML += `
			<a onclick = "populateDevInfo(${i})" id = "devicon${i}" class = "devsicon"></a>
		`
		document.getElementById("devicon"+i).style.backgroundImage = `url(${devsdata[i].image}.png)`;
	}
	var w = Object.keys(devsdata).length
	while (w>0){
		makeHoverable(w)
		w=w-1
	}
	populateDevInfo(1)
}

function getDevsData() {
    $.ajax({
        type: 'GET',
        url: "../static/data/devs.json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                devsdata = data;
				populateDevsData();
            }
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
			populateDevsData();
        }
    });
}

var profiledata = {}
function populateProfileData(userid){
	var curprofdata = {}
	for (const [key, value] of new Map(Object.entries(profiledata))) {
		if (key == userid){
			curprofdata = value
			break
		}
	}

	var allgames = curprofdata.statistics.games.won + curprofdata.statistics.games.lost
	if(allgames==0){
		allgames=1 //for normal count
	}

	document.getElementById("usertitle").innerHTML = `The Hunger Games: ${curprofdata.name}`
	document.getElementById("playername").innerHTML = `${curprofdata.name}`
	document.getElementById("playeravatar").style.backgroundImage = `url(${curprofdata.image}`;
	document.getElementById("playerrating").innerHTML = `${curprofdata.statistics.rank}`
	document.getElementById("playerallgames").innerHTML = `${allgames}`
	document.getElementById("playerallgamesjoined").innerHTML = `${curprofdata.statistics.games.joined}`
	document.getElementById("playerallgamesleft").innerHTML = `${curprofdata.statistics.games.left}`
	document.getElementById("playerwins").innerHTML = `${curprofdata.statistics.games.won}`
	document.getElementById("playerdefeats").innerHTML = `${curprofdata.statistics.games.lost}`
	document.getElementById("playerwinperc").innerHTML = `${(curprofdata.statistics.games.won/allgames*100)}%`
	document.getElementById("playerkilledplayers").innerHTML = `${curprofdata.statistics.killed.players}`
	document.getElementById("playerkilledmobs").innerHTML = `${curprofdata.statistics.killed.mobs}`
	document.getElementById("playerdeath").innerHTML = `${curprofdata.statistics.death}`
}

function getProfileData(userid) {
    $.ajax({
        type: 'GET',
        url: "../static/data/playersdata.json",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data) {
                profiledata = data;
				populateProfileData(userid);
            }
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
			populateProfileData(userid);
        }
    });
}
//updateProgress(); //just to not forget and not find 'em anywhere
//translatePage();
//countdown();
//getPlayersData();
//getNewsData();
//getDevsData();
//getProfileData();
