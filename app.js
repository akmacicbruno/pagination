var ArrayPosts = [];
function getPosts() {
    // For now, consider the data is stored on a static json file
    return fetch('https://jsonplaceholder.typicode.com/posts')
        // the JSON body is taken from the response
        .then(function (res) { return res.json(); })
        .then(function (res) {
        // The response has an `any` type, so we need to cast
        // it to the `Posts` type, and return it from the promise
        return res;
    });
}
var result = document.getElementById('app');
//Ispis podataka s API-a 
var display = getPosts().then(function (posts) {
    for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
        var post = posts_1[_i];
        //  result.insertAdjacentHTML("beforeend", 
        //  `<div class=card-app>
        //  <p class="card-app__id">${post.id}</p>
        //  <h4 class="card-app__title">${post.title}</h4>
        //  <p class="card-app__text" id="text">${post.body}</p>
        //  </div>`);
        ArrayPosts.push(post);
    }
    //Učitavanje inciijalnih 6 postova ili onoliko koliko stranica je uneseno u URL page parametar
    var URLpageSearch = new URLSearchParams(window.location.search);
    var current_index1 = 0;
    var max_posts = parseInt(URLpageSearch.get('page')) * 6;
    if (!URLpageSearch.has('page')) {
        max_posts = 6;
    }
    if (parseInt(URLpageSearch.get('page')) < 1 || !parseInt(URLpageSearch.get('page'))) {
        URLpageSearch.set('page', '1');
        window.history.replaceState({}, '', location.pathname + "?" + URLpageSearch);
        max_posts = 6;
    }
    var pageSize = ArrayPosts.length / 6;
    var lastPage = Math.round(pageSize);
    if (parseInt(URLpageSearch.get('page')) >= lastPage) {
        URLpageSearch.set('page', lastPage.toString());
        window.history.replaceState({}, '', location.pathname + "?" + URLpageSearch);
        max_posts = ArrayPosts.length;
        document.getElementById('btn-more').classList.add('hide');
    }
    for (var i = 0; i < max_posts; i++) {
        if (ArrayPosts.length <= document.getElementsByClassName('card-app').length) {
            document.getElementById("btn-more").classList.add("hide");
            document.getElementById("error").innerHTML = "No more to show!";
            return;
        }
        result.insertAdjacentHTML("beforeend", "<div class=card-app>\n        <p class=\"card-app__id\">" + ArrayPosts[i + current_index1].id + "</p>\n        <h4 class=\"card-app__title search-text\">" + ArrayPosts[i + current_index1].title + "</h4>\n        <p class=\"card-app__text search-text\" id=\"text\">" + ArrayPosts[i + current_index1].body + "</p>\n        </div>");
    }
    current_index1 += max_posts;
    console.log(current_index1);
    Search();
    //Učitavanje sljedećih 6 postova klikom na gumb "Load more", update URLa 
    var current_index = current_index1;
    document.getElementById("btn-more").onclick = function (e) {
        e.preventDefault();
        var max_content = 6;
        var pageNum = (current_index + max_content) / max_content;
        for (var i = 0; i < max_content; i++) {
            if (ArrayPosts.length <= document.getElementsByClassName('card-app').length) {
                document.getElementById("btn-more").classList.add("hide");
                document.getElementById("error").innerHTML = "No more to show!";
                pageNum++;
                window.history.replaceState({}, '', location.pathname + "?" + params);
                current_index += max_content;
                return;
            }
            result.insertAdjacentHTML("beforeend", "<div class=card-app>\n                <p class=\"card-app__id\">" + ArrayPosts[i + current_index].id + "</p>\n                <h4 class=\"card-app__title\">" + ArrayPosts[i + current_index].title + "</h4>\n                <p class=\"card-app__text\" id=\"text\">" + ArrayPosts[i + current_index].body + "</p>\n                </div>");
            var params = new URLSearchParams(window.location.search);
            params.set('page', pageNum.toString());
        }
        pageNum++;
        window.history.replaceState({}, '', location.pathname + "?" + params);
        current_index += max_content;
        console.log(current_index);
        Search();
    };
});
//Live pretraga učitanih postova
function Search() {
    var inputFilter = document.getElementById("search");
    var filterList = document.getElementById("app");
    var filterItem = filterList.querySelectorAll("div");
    var BtnMore = document.getElementById('btn-more');
    //Search na pritisak entera
    inputFilter.addEventListener("keyup", function (e) {
        if (e.code === "Enter") {
            var defaultURL = new URL("http://127.0.0.1:5500/index.html");
            var searchValue = document.getElementById("search").value;
            var params = new URLSearchParams(window.location.search);
            params.set('search', searchValue);
            window.history.replaceState({}, '', location.pathname + "?" + params);
            var inputValue = inputFilter.value, i;
            for (i = 0; i < filterItem.length; i++) {
                var _this = filterItem[i];
                var phrase = _this.innerHTML;
                if (phrase.search(new RegExp(inputValue, "i")) < 0) {
                    _this.classList.add("hide");
                    _this.classList.remove("show");
                }
                else if (phrase.search(new RegExp(inputValue, "i")) > 0) {
                    _this.classList.add("show");
                    _this.classList.remove("hide");
                    BtnMore.classList.add("hide");
                }
            }
        }
    });
    //URL search
    var params = new URLSearchParams(window.location.search), i;
    var inputValueSearch = params.get('search');
    if (params.has('search')) {
        for (i = 0; i < filterItem.length; i++) {
            var _this = filterItem[i];
            var phrase = _this.innerHTML;
            if (phrase.search(new RegExp(inputValueSearch, "i")) < 0) {
                _this.classList.add("hide");
                _this.classList.remove("show");
            }
            else if (phrase.search(new RegExp(inputValueSearch, "i")) > 0) {
                _this.classList.add("show");
                _this.classList.remove("hide");
                BtnMore.classList.add("hide");
            }
        }
    }
    if (!params.has('search') || inputFilter.value.length <= 0) {
        deleteSearch();
    }
}
//Dohvaćanje vrijednosti 'search' iz URLa i njeno zapisivanje u HTML input element s id 'search'
(function () {
    var params = new URLSearchParams(window.location.search);
    document.getElementById("search").value = params.get("search");
})();
//funkcija za brisanje parametara iz URLa
function deleteSearch() {
    var myURL = new URLSearchParams(window.location.search);
    myURL["delete"]('search');
    window.history.replaceState({}, '', location.pathname + "?" + myURL);
}
