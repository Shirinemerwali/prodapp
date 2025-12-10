import { useState } from "react";

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (

    <div className="home_container">
        <div className= "home_leftside">
            <img src="" alt="Prodapp illustration" />
        </div>
        <div className="home_rightside">
            {!showLogin && !showSignup && (
            <>
                <h1>Välkommen till <span className="highlight">Prodapp</span>, din produktivitetsassistent!</h1>
                <p>Håll koll på dina uppgifter, vanor och evenemang på ett och samma ställe.</p>
                <div className="home-btns">
                    <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Logga in</button>
                    <button className="btn btn-outline" onClick={() => setShowSignup(true)}>Registrera dig</button>
                </div>
            </>
            )}
            {showLogin && (
                <form>
                    <h2>Logga in</h2>
                    <input placeholder="Användarnamn" />
                    <input placeholder="Lösenord" type="password" />
                    <button className="btn btn-primary" type="submit">Logga in</button>
                    <button className="btn btn-outline" type="button" onClick={() => setShowLogin(false)}>
                        Tillbaka
                    </button>
                    </form>
            )}

            {showSignup && (
                <form>
                    <h2>Registrera dig</h2>
                    <input placeholder="Användarnamn" />
                    <input placeholder="Lösenord" type="password" />
                    <input placeholder="Bekräfta lösenord" type="password" />
                    <button className="btn btn-primary" type="submit">Registrera</button>
                    <button className="btn btn-outline" type="button" onClick={() => setShowSignup(false)}>
                        Tillbaka
                    </button>
                </form>
            )}
        </div>
    </div>

    );

}

export default Home;