const fetch = require('node-fetch');
const cheerio = require('cheerio');

let classInfo = [];

async function fetchData() {
  let url = 'https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController';

  // initial fetch to set the initial search parameters and get the Set-Cookie header
  let initialOptions = {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://globalsearch.cuny.edu',
      'Referer': 'https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    body: 'selectedInstName=Hunter+College+%7C+&inst_selection=HTR01&selectedTermName=2024+Spring+Term&term_value=1242&next_btn=Next'
  };
  let initialResponse = await fetch(url, initialOptions);
  let cookie = initialResponse.headers.get('set-cookie'); // Extract the cookie from the Set-Cookie header

  // second fetch to set the additional search parameters and perform the search
  let searchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie,
      'Origin': 'https://globalsearch.cuny.edu',
      'Referer': 'https://globalsearch.cuny.edu/CFGlobalSearchTool/CFSearchToolController',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    body: 'selectedSubjectName=Computer+Science&subject_name=CMSC&selectedCCareerName=Undergraduate&courseCareer=UGRD&selectedCAttrName=&courseAttr=&selectedCAttrVName=&courseAttValue=&selectedReqDName=&reqDesignation=&open_class=O&selectedSessionName=&class_session=&selectedModeInsName=&meetingStart=LT&selectedMeetingStartName=less+than&meetingStartText=&AndMeetingStartText=&meetingEnd=LE&selectedMeetingEndName=less+than+or+equal+to&meetingEndText=&AndMeetingEndText=&daysOfWeek=I&selectedDaysOfWeekName=include+only+these+days&instructor=B&selectedInstructorName=begins+with&instructorName=&search_btn_search=Search'
  };
  let response = await fetch(url, searchOptions);
  let htmlString = await response.text();

  let $ = cheerio.load(htmlString);
  let rows = $('.classinfo tbody tr');

  rows.each((i, row) => {
    let cells = $(row).find('td');
  
    // parse class data
    let classData = {
      Class: $(cells[0]).text(),
      Section: $(cells[1]).text(),
      'Days & Times': $(cells[2]).text(),
      Room: $(cells[3]).text(),
      Instructor: $(cells[4]).text(),
      'Instruction Mode': $(cells[5]).text(),
      'Meeting Dates': $(cells[6]).text(),
      Status: "Open✅",
      'Course Topic': $(cells[8]).text()
    };

    classInfo.push(classData);
  });

  return classInfo; 
}

module.exports = fetchData;
