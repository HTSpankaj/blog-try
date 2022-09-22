import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Script from "next/script";
import Image from "next/image";
import Link from 'next/link';

const css = ' .loadMoreLoader { --parent-color: #6363CC; --parent-widthHeight: 80px; --parent-innerWidthHeight: 64px; --parent-borderWidth: 6px; }';
export default function Home() {

  const router = useRouter()
  const { BlogId } = router.query

  const [blogsDetails, setBlogDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(() => {
    let createCssElement = document.createElement("style");
    createCssElement.appendChild(document.createTextNode(css));
    document.getElementById("BlogDetailsStyleID").appendChild(createCssElement);

  }, []);

  useEffect(() => {
    if (BlogId) {
      setIsLoading(true);
      axios.get('http://localhost:8000/blog/'+BlogId).then((resp) => {
        console.log(" ------> ",resp.data);
        setIsLoading(false);
        if (resp.data.success) {
          setBlogDetails(resp.data.data)
        }
      });
    }
  }, [BlogId])
  

  function loadMode() {
    let _pageNumber = pageNumber + 1;
    setPageNumber(_pageNumber);
    getServerData(selectedCategory, _pageNumber, true);
  }

  return (
    <div>
      <>
        <Header />
      </>

      <div id="BlogID" style={{minHeight: '500px', display: "flex", flexDirection: "column", justifyContent: isLoading ? "center" : "unset", alignItems: isLoading ? "center" : "unset"}}>

        {isLoading ? 
          <div className="lds-dual-ring loadMoreLoader"></div>
          :
          <div style={{width: "min(1200px, 90%)", display: "flex", flexDirection: "column", flexWrap: 'wrap',justifyContent: 'space-between', margin: "2rem auto"}} className={"blogWrapper"}>
            <div>
              <p style={{fontSize: '48px', lineHeight: '60px', color: '#1A0937', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', margin: "0"}}>
                {blogsDetails?.title}
              </p>

              <p style={{fontSize: '20px', lineHeight: '30px', color: '#475467', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '400', margin: "24px 0"}}>
                {blogsDetails?.description}
              </p>
            </div>

            <div style={{marginTop: "32px"}}>
              <div style={{height: '30rem',display: 'flex',flexDirection: 'column',justifyContent: 'center',background: '#f0f0ff'}}>
                <Image src={blogsDetails?.coverImageUrl} alt="" width={"100%"} height={"100%"} layout={"responsive"}/>
              </div>
              <div style={{display: 'flex',flexDirection: 'row', gap: "30px", marginTop: "20px"}}>
                <div style={{display: 'flex',flexDirection: 'row', gap: "30px"}}>
                  <div>
                    <p style={{fontSize: '14px', lineHeight: '20px', color: '#4141A5', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', margin: "0"}}>
                      Written by
                    </p>
                    <p style={{fontSize: '18px', lineHeight: '28px', color: '#101828', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', margin: "12px 0 0 0"}}>
                      {blogsDetails?.author}
                    </p>
                  </div>
                  <div>
                    <p style={{fontSize: '14px', lineHeight: '20px', color: '#4141A5', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', margin: "0"}}>
                      Published on
                    </p>
                    <p style={{fontSize: '18px', lineHeight: '28px', color: '#101828', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', margin: "12px 0 0 0"}}>
                      {new Date(blogsDetails?.publishDate).toDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div dangerouslySetInnerHTML={{__html: blogsDetails?.content}} ></div>
            </div>


          </div>
        }

        <div id="BlogDetailsStyleID"></div>
      </div>

      <>
        <Footer />
      </>
      <Script src="https://nqhkpgaezalnpxtizxzv.supabase.co/storage/v1/object/public/scripts/FormScripts/formScript.js" />
    </div>
  );
}
