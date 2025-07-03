import CommitForm from "./components/CommitForm";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout >
      <h1 className="lg:text-5xl text-3xl font-bold text-white mb-8 text-center">
        No Progress = No Mercy
      </h1>
      <CommitForm />
    </Layout>
  );
}

export default App;
