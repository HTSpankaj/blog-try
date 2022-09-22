import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Script from "next/script";
import Image from "next/image";
import Link from 'next/link';

const css = " .blogWrapper { }.blogItem { flex-basis: 30% } .loadMoreButton { display: flex; align-items: center; align-content: center; gap: 1rem; background: #4141A5; font-family: 'Poppins'; font-style: normal; font-weight: 700; font-size: 18px; line-height: 27px; color: #FFFFFF; border-radius: 10px; padding: 1rem 1.2rem; cursor: pointer; border: none; box-shadow: 0px 20px 30px -16px rgba(103, 46, 188, 0.3); } .loadMoreLoader { --parent-color: #FFF; --parent-widthHeight: 23px; --parent-innerWidthHeight: 17px; --parent-borderWidth: 3px; } @media (max-width: 750px) { .blogItem { flex-basis: 45% } } @media (max-width: 500px) { .blogItem { flex-basis: 100% } } ";
export default function Home() {

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoreData, setIsMoreData] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  

  useEffect(() => {
    let createCssElement = document.createElement("style");
    createCssElement.appendChild(document.createTextNode(css));
    document.getElementById("BlogStyleID").appendChild(createCssElement);

    getServerData(selectedCategory, pageNumber, false);
  }, []);

  function getServerData(_selectedCategory, _pageNumber, isMerge) {
    setIsLoading(true);
    axios.get('http://localhost:8000/blog/project3/'+_selectedCategory+'/'+_pageNumber).then((resp) => {
      // console.log(" ------> ",resp.data);
      setIsLoading(false);
      if (resp.data.success) {
        setIsMoreData(resp.data.isMore);
        if (resp.data.category && resp.data.category.length > 0) {
          setCategory([...resp.data.category]);
        }
        if (isMerge) {
          setBlogs([...blogs, ...resp.data.blogs]);
        } else {
          setBlogs([...resp.data.blogs]);
        }
      }
    });
  }

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

      <div id="BlogID">
        <div>

          <div style={{width: "min(1200px, 90%)", display: "flex", flexDirection: "row", gap: "2rem", margin: "2rem auto", flexWrap: 'wrap',justifyContent: 'space-between'}} className={"blogWrapper"}>
            {
              blogs.map((blogItem, index) => (
                <Link href={'Blog/'+blogItem.id} key={'Blog_'+(index+1)}>
                  <div 
                  
                    style={{
                      padding: '1.5rem',
                      background: '#FFFFFF',
                      boxShadow: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
                      flexGrow: '0',
                      flexShrink: '0',
                      // flexBasis: '30%'
                      cursor: "pointer"
                    }}
                    className={"blogItem"}
                  >
                    
                    <div style={{height: '15rem',display: 'flex',flexDirection: 'column',justifyContent: 'center',background: '#f0f0ff'}}>
                      <Image src={blogItem.coverImageUrl} alt="" width={"100%"} height={"100%"} layout={"responsive"}/>
                    </div>

                    <div>
                      <div>
                        <p style={{display: 'block', display: '-webkit-box', maxWidth: '400px', fontSize: '14px', lineHeight: '1.4', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', color: '#4141A5', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600'}}>
                          {blogItem.tags}
                        </p>
                      </div>
                      <div>
                        <p style={{display: 'block', display: '-webkit-box',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '600',fontSize: '24px',lineHeight: '1.4',color: '#101828', textOverflow: 'ellipsis',overflow: 'hidden', lineHeight: '1.4', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2'}}>
                          {blogItem.title}
                        </p>
                      </div>
                      <div>
                        <p style={{display: 'block', display: '-webkit-box',fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '400',fontSize: '16px',lineHeight: '1.4',color: '#475467',textOverflow: 'ellipsis', overflow: 'hidden', lineHeight: '1.4', WebkitBoxOrient: 'vertical', WebkitLineClamp: '3'}}>
                          {blogItem.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p style={{display: 'block', display: '-webkit-box', maxWidth: '400px', fontSize: '14px', lineHeight: '1.4', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', color: '#101828', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', margin: "0"}}>
                        {blogItem.author}
                      </p>
                      <p style={{display: 'block', display: '-webkit-box', maxWidth: '400px', fontSize: '14px', lineHeight: '1.4', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475467', fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '400', margin: "0"}}>
                        {new Date(blogItem.publishDate).toDateString()}
                      </p>
                      
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>

          { isMoreData && 
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              <button className="loadMoreButton" style={{pointerEvents: isLoading ? "none" : "auto"}} onClick={loadMode}>
                Load Mode 
                {(isLoading && blogs.length) && <div className="lds-dual-ring loadMoreLoader"></div>}
              </button>
            </div>
          }

          <div id="BlogStyleID"></div>
        </div>
      </div>

      <>
        <Footer />
      </>
      <Script src="https://nqhkpgaezalnpxtizxzv.supabase.co/storage/v1/object/public/scripts/FormScripts/formScript.js" />
    </div>
  );
}
