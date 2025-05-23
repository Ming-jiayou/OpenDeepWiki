import { getWarehouseOverview } from '../../services';
import { ServerLoadingErrorState } from '../../components/document/ServerComponents';
import ClientRepositoryPage from './ClientRepositoryPage';
import RepositoryInfo from './RepositoryInfo';
import { checkGitHubRepoExists } from '../../services/githubService';

// 服务器组件，处理数据获取
export default async function RepositoryPage({ params }: any) {
  try {
    const owner = params.owner;
    const name = params.name;

    if (!owner || !name) {
      throw new Error('Missing owner or repository name');
    }

    // 在服务器端获取数据
    const response = await getWarehouseOverview(owner, name);

    // 如果获取数据失败，尝试从GitHub获取仓库信息
    if (!response.success || !response.data) {
      // 检查GitHub仓库是否存在
      const githubRepoExists = await checkGitHubRepoExists(owner, name);
      
      // 如果GitHub仓库存在，则显示GitHub仓库信息
      if (githubRepoExists) {
        return (
          <RepositoryInfo
            owner={owner}
            name={name}
          />
        );
      } else {
        // 如果GitHub仓库也不存在，则显示添加仓库提示
        return (
          <RepositoryInfo
            owner={owner}
            name={name}
          />
        );
      }
    }

    // 将数据传递给客户端组件进行渲染
    return (
      <ClientRepositoryPage
        owner={owner}
        name={name}
        document={response.data}
      />
    );
  } catch (error) {
    const owner = params?.owner || "";
    const name = params?.name || "";
    
    // 出现错误时也展示GitHub仓库信息（如果有）
    return (
      <RepositoryInfo
        owner={owner}
        name={name}
      />
    );
  }
}
