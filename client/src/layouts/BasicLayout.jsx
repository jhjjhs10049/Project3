import BasicMenu from "../components/menus/BasicMenu.jsx";
import Footer from "../components/menus/Footer.jsx";

const BasicLayout = ({ children }) => {
  return (
    <>
      <BasicMenu />

      <div
        className="bg-white my-5 w-full flex flex-col "
      >
        <main className="bg-sky-300">
          {children}
        </main>
        {/* <aside className="bg-green-300 md:w-1/3 lg:w-1/4 px-5 flex py-5">
          <h1 className="text-2xl md:text-4xl"> Sidebar </h1>
        </aside> */}
      </div>
      
      <Footer />
    </>
  );
};
export default BasicLayout;
