$(document).ready(function () {

  //Page1 Script.js
  let selectOption = $("#header-selectId");
  let dropDown = $("#option-selectId");
  let singleItem = $(".single-item");
  const button = $(".hamburger");
  let headerList = $(".header-list");
  let headerContact = $(".header-contact");
  let index = 0;

  // Fetching data from data.json for Slick Slider
  fetch("../data.json").then((response) => response.json()).then((json) => {
    const arrObj = Object.keys(json).map(key => json[key]);
    loadSlides(arrObj);
    addTextToSlide(arrObj);
  }).then((json) => {
    //When data is fetched i'm using colorLastWord Function
    colorLastWord();
  }).catch(error => alert(error + ". Please run on local-host server"));

  //Adding text to DOM elements and implementing in Slick Slider
  function addTextToSlide(arr) {
    for (let i = 0; i < arr.length; i++) {
      let description = $("<p class=\"slider-paragraph\"></p>").text(arr[i].description);
      let tittle = $("<h1 class=\"slider-heading\"></h1>").text(arr[i].tittle);
      let btn = $("<button class=\"slider-button\"></button>").text(arr[i].btnText);
      let container = $("<div class=\"slides\"></div>");
      container.append(tittle, description, btn);
      singleItem.slick("slickAdd", container);
    }
  }

  //On eventHandler resize setting length of DOM element dynamically
  $(window).resize(function () {
    followLength();
    appendPhoneNumber();
    let background=$(".business-background")
    background.css("height", $(".business-section").height());
    let arrowImg = $(".arrow-select");
    arrowImg.css("height", $("#header-selectId").height());
  });

  //Toggle DropDown on hover
  selectOption.hover(function () {
    $("#google-map").toggleClass("toggle-z-index");
    dropDown.toggle();
    followLength();
  })

  //Set width of DOM element dynamically
  function followLength() {
    dropDown.css("width", selectOption.width());
  }

  //Hamburger button activation and toggle Header navigation
  button.click(function () {
    button.toggleClass("active");
    headerList.toggleClass("toggleList")
  })

  //DOM manipulation with phone Number and Flag Avatar when screen width goes under 481
  function appendPhoneNumber() {
    if ($(window).width() < 481) {
      $(dropDown).prepend(headerContact);
      $(".sprite-icons-flag").appendTo(".header-contact");
    } else {
      $(".sprite-icons-flag").appendTo(".header-row");
      $(headerContact).insertBefore(".hamburger");
    }
  }
  appendPhoneNumber();

  //Color last word of main Heading of Slick slider, because i'm fetching it from data.json dynamically
  function colorLastWord() {
    $(".slider-heading").html(function (index, curHTML) {
      var text = curHTML.split(/[\s-]/);
      let newtext = "<span class=\"heading-red\">" + text.pop() + "</span>";
      return text.join(" ").concat(" " + newtext);
    });
  }

  //Load slides for first time and setting index based on nextSlide value,nexSlide are number values: 0 or 1 or 2
  function loadSlides(data) {
    showSlidesBackgrounds(data);
    $(".single-item").on("beforeChange", function (event, slick, currentSlide, nextSlide) {
      index = nextSlide;
      showSlidesBackgrounds(data);
    });
  }

  //Slider Configuration
  $(".single-item").slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true
  });

  //Dynamically setting background images for sliders
  function showSlidesBackgrounds(slides) {
    $(".column-background").css("background-image", `url(${slides[index].path})`);
    $(".column-background-second").css("background-image", `url(${slides[index].path2})`);
  }
  //-----------------------------------------------------------------------------------------------------
  //Page2 Script.js
  //Tab functionality
  $(".tab").hide();
  $("ul.tabs li").click(function () {
    $(".tab").hide();
    $($(".tab")[$(this).index()]).show();
  }).first().trigger("click");

  //Usage of iCheck replacer
  $('input').iCheck({
    checkboxClass: 'icheckbox_flat-grey',
    radioClass: 'iradio_flat-grey'
  });

  //---------------------------------------------------------------------------------------------
  //Page3 Script.js
  //Fetching data from store.csv and rendering table
  function renderTable() {
    $.ajax({
      url: "store.csv",
      dataType: "text",
      success: function (data) {
        var store_data = data.split(/\r?\n|\r/);
        var table_data = "<table class=\"table table-bordered table-striped\">";
        for (var count = 0; count < store_data.length; count++) {
          var cell_data = store_data[count].split(",");
          table_data += "<tr>";
          for (var cell_count = 0; cell_count < cell_data.length; cell_count++) {
            if (count === 0) {
              table_data += "<th>" + cell_data[cell_count] + "</th>";
            } else {
              if (cell_data[cell_count] === "Srbija") {
                table_data += "<td class=\"country\" data-country=\"Srbija\">" + cell_data[cell_count] + "</td>";
              } else if (cell_data[cell_count] === "Nemacka") {
                table_data += "<td class=\"country\" data-country=\"Nemacka\">" + cell_data[cell_count] + "</td>";
              } else if (cell_data[cell_count] === "Fransiza") {
                table_data += "<td class=\"market\" data-selling=\"Fransiza\">" + cell_data[cell_count] + "</td>";
              } else if (cell_data[cell_count] === "Veleprodaja") {
                table_data += "<td class=\"market\" data-selling=\"Veleprodaja\">" + cell_data[cell_count] + "</td>";
              } else if (cell_data[cell_count] === "Maloprodaja") {
                table_data += "<td class=\"market\" data-selling=\"Maloprodaja\">" + cell_data[cell_count] + "</td>";
              } else {
                table_data += "<td>" + cell_data[cell_count] + "</td>";
              }
            }
          }
          table_data += "</tr>";
        }
        table_data += "</table>";
        $("#store_table").html(table_data);
      }
    });
  }
  renderTable();

  //Switchers -> true / false change on click button filter
  let switcherSerbia = false;
  let switcherGermany = false;
  let switcherFranchise = false;
  let switcherWholesale = false
  let switcherRetail = false;


  $(".option-buttons").click(function () {
    let currentButtonValue = $(this).val();
    //Setting filters and switchers based on clicked button's value
    settingFilters(currentButtonValue);
    //Rendering filtered table
    filterFunction();
  });
  //Intially all rows will be shown
  $("table tbody tr").show();

  function filterFunction() {
    //Hide all rows except first row
    $("table tbody").find("tr:gt(0)").hide();
    //Changing flags used for rendering choices
    //Setting intial values and flags needed
    var countryFlagSerbia = 0;
    var countryValueSerbia = returnValueOptionSerbiaCountry();
    var countryFlagGermany = 0;
    var countryValueGermany = returnValueOptionGermanyCountry();
    var marketFlagFranchise = 0;
    var marketValueFranchise = returnValueOptionFranchise();
    var marketFlagWholesale = 0;
    var marketValueWholesale = returnValueOptionWholesale();
    var marketFlagRetail = 0;
    var marketValueRetail = returnValueOptionRetail();

    //Traversing each row one by one
    $("table tr").each(function () {
      if (!($(this).children("th").length > 0)) {
        if (countryValueSerbia == 0) { //If no value then display row
          countryFlagSerbia = 1;
        } else if (countryValueSerbia == $(this).find("td.country").data("country")) {
          countryFlagSerbia = 1; //If value is same display row
        } else {
          countryFlagSerbia = 0;
        }
        if (countryValueGermany == 0) { //If no value then display row
          countryFlagGermany = 1;
        } else if (countryValueGermany == $(this).find("td.country").data("country")) {
          countryFlagGermany = 1; //If value is same display row
        } else {
          countryFlagGermany = 0;
        }
        if (marketValueFranchise == 0) {
          marketFlagFranchise = 1;
        } else if (marketValueFranchise == $(this).find("td.market").data("selling")) {
          marketFlagFranchise = 1;
        } else {
          marketFlagFranchise = 0;
        }
        if (marketValueWholesale == 0) {
          marketFlagWholesale = 1;
        } else if (marketValueWholesale == $(this).find("td.market").data("selling")) {
          marketFlagWholesale = 1;
        } else {
          marketFlagWholesale = 0;
        }
        if (marketValueRetail == 0) {
          marketFlagRetail = 1;
        } else if (marketValueRetail == $(this).find("td.market").data("selling")) {
          marketFlagRetail = 1;
        } else {
          marketFlagRetail = 0;
        }



        if ((switcherGermany || switcherSerbia) && (switcherFranchise || switcherWholesale || switcherRetail)) {
          if (switcherSerbia && switcherFranchise) {
            if (countryFlagSerbia && marketFlagFranchise) {
              $(this).show();
            }
          }
          if (switcherSerbia && switcherWholesale) {
            if (countryFlagSerbia && marketFlagWholesale) {
              $(this).show();
            }
          }
          if (switcherSerbia && switcherRetail) {
            if (countryFlagSerbia && marketFlagRetail) {
              $(this).show();
            }
          }

          if (switcherSerbia && switcherFranchise && switcherWholesale) {
            if (countryFlagSerbia && (marketFlagFranchise || marketFlagWholesale)) {
              $(this).show();
            }
          } else if (switcherSerbia && switcherRetail && switcherWholesale) {
            if (countryFlagSerbia && (marketFlagRetail || marketFlagWholesale)) {
              $(this).show();
            }
          } else if (switcherSerbia && switcherRetail && switcherFranchise) {
            if (countryFlagSerbia && (marketFlagRetail || marketFlagFranchise)) {
              $(this).show();
            }
          }

          if (switcherGermany && switcherFranchise) {
            if (countryFlagGermany && marketFlagFranchise) {
              $(this).show();
            }
          }
          if (switcherGermany && switcherWholesale) {
            if (countryFlagGermany && marketFlagWholesale) {
              $(this).show();
            }
          }
          if (switcherGermany && switcherRetail) {
            if (countryFlagGermany && marketFlagRetail) {
              $(this).show();
            }
          }

          if (switcherGermany && switcherFranchise && switcherWholesale) {
            if (countryFlagGermany && (marketFlagFranchise || marketFlagWholesale)) {
              $(this).show();
            }
          } else if (switcherGermany && switcherRetail && switcherWholesale) {
            if (countryFlagGermany && (marketFlagRetail || marketFlagWholesale)) {
              $(this).show();
            }
          } else if (switcherGermany && switcherRetail && switcherFranchise) {
            if (countryFlagGermany && (marketFlagRetail || marketFlagFranchise)) {
              $(this).show();
            }
          }
        } else {
          if (switcherGermany && switcherSerbia) {
            if (countryFlagGermany || countryFlagSerbia) {
              $(this).show();
            }
          } else if (switcherGermany) {
            if (countryFlagGermany) {
              $(this).show();
            }
          } else if (switcherSerbia) {
            if (countryFlagSerbia) {
              $(this).show();
            }
          }

          if (switcherFranchise && switcherWholesale) {
            if (marketFlagFranchise || marketFlagWholesale) {
              $(this).show();
            }
          } else if (switcherFranchise && switcherRetail) {
            if (marketFlagFranchise || marketFlagRetail) {
              $(this).show();
            }
          } else if (switcherFranchise) {
            if (marketFlagFranchise) {
              $(this).show();
            }
          }

          if (switcherRetail && switcherWholesale) {
            if (marketFlagRetail || marketFlagWholesale) {
              $(this).show();
            }
          } else if (switcherRetail) {
            if (marketFlagRetail) {
              $(this).show();
            }
          } else if (switcherWholesale) {
            if (marketFlagWholesale) {
              $(this).show();
            }
          }

          if (countryFlagSerbia && countryFlagGermany && marketFlagFranchise && marketFlagWholesale && marketFlagRetail) {
            $(this).show();
          }
        }
      }
    });
  }

  function returnValueOptionSerbiaCountry() {
    if (switcherSerbia) {
      return "Srbija";
    } else {
      return 0
    }
  }

  function returnValueOptionGermanyCountry() {
    if (switcherGermany) {
      return "Nemacka";
    } else {
      return 0
    }
  }

  function returnValueOptionFranchise() {
    if (switcherFranchise) {
      return "Fransiza";

    } else {
      return 0
    }
  }

  function returnValueOptionWholesale() {
    if (switcherWholesale) {
      return "Veleprodaja";

    } else {
      return 0
    }
  }

  function returnValueOptionRetail() {
    if (switcherRetail) {
      return "Maloprodaja";

    } else {
      return 0
    }
  }



  function settingFilters(currentButtonValue) {
    if (currentButtonValue === "Srbija") {
      switcherSerbia = !switcherSerbia;
      $("#button-serbia").toggleClass("activeOption")
    } else if (currentButtonValue === "Nemacka") {
      switcherGermany = !switcherGermany;
      $('#button-germany').toggleClass("activeOption")
    } else if (currentButtonValue === "Fransiza") {
      switcherFranchise = !switcherFranchise;
      $("#button-franchise").toggleClass("activeOption")
    } else if (currentButtonValue === "Veleprodaja") {
      switcherWholesale = !switcherWholesale;
      $("#button-wholesale").toggleClass("activeOption")
    } else if (currentButtonValue === "Maloprodaja") {
      switcherRetail = !switcherRetail;
      $('#button-retail').toggleClass("activeOption")
    }
  }

  //Remove shadow if scrollTop is higher then 50, and map became usefull
  $(window).scroll(function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > 50) {
      $(".about-location-map").css("z-index", "0");
    } else {
      $(".about-location-map").css("z-index", "-1");
    }
  });

  //After reloading page when is clicked only on header-link color ceratin link based on windiw href
  $(".header-link").click(function () {
    sessionStorage.reloadAfterPageLoad = true;
  })

  $(function () {
    if (sessionStorage.reloadAfterPageLoad) {
      sessionStorage.reloadAfterPageLoad = false;
      if (window.location.href === "http://localhost:3000/index.html") {
        $(".page1").addClass("actived");
        $(".page1").siblings().removeClass("actived");
      } else if (window.location.href === "http://localhost:3000/gdekupiti.html") {
        $(".page2").addClass("actived");
        $(".page2").siblings().removeClass("actived");
      } else if (window.location.href === "http://localhost:3000/filter.html") {
        $(".page3").addClass("actived");
        $(".page3").siblings().removeClass("actived");
      }
    }
  });

  //Change color on clicking tabs
  $(".description-item").click(function () {
    let currentLink = $(this);
    currentLink.addClass("actived");
    currentLink.siblings().removeClass("actived");
  })

  $(function() {
    let background=$(".business-background");
    let arrowImg = $(".arrow-select");
    background.css("height", $(".business-section").height());
    arrowImg.css("height", $("#header-selectId").height());
    
  
  });

});
