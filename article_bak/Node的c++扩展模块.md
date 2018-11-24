最近看《深入浅出Node.js》的模块部分，看到c/c++模块部分，便想按书上那样试下写个模块，没想到照抄书上代码，用node-gyp出错了，只好查官方文档，才发现由于版本更新换代，各种类的定义和用法都不一样了。然而Node.js官网文档对c/c++模块的编写也没有很详细的说明，只有一个[页面](https://nodejs.org/dist/latest-v6.x/docs/api/addons.html)，都是基本的例子，但是都很有代表性，我参照上面，写了一个快排模块。

先上代码：
```
#include <node.h>
#include <v8.h>
#include <iostream>

using v8::FunctionCallbackInfo;
using v8::Function;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Array;
using v8::Value;
using v8::Exception;
using v8::Number;
using v8::Handle;
using v8::Context;

using namespace std;

//一般的c++快排函数
void qSort(double* arr, int l, int r) {

    double k = arr[(l + r) / 2];
    int i = l, j = r;

    do {
        while (arr[i] < k && i < r) ++i;
        while (arr[j] > k && j > l) --j;
        if (i <= j) {
            double swap = arr[i];
            arr[i] = arr[j];
            arr[j] = swap;
            ++i;
            --j;
        }
    } while (i <= j);

    if (i < r) qSort(arr, i, r);
    if (j > l) qSort(arr, l, j);

}

//要导出的模块函数,参数为js数组
void MyQuickSort(const FunctionCallbackInfo<Value>& args) {

    Isolate* isolate = args.GetIsolate();
    if (args[0]->IsArray()) { // 判断参数是否为数组

        Local<Object> arr = args[0]->ToObject(); // v8中没有参数转为数组的方法，只有转成对象处理
        Local<Array> keys = arr->GetOwnPropertyNames(); // 获取所有键值(下标)
        int length = keys->Length(); // 获取数组长度

        double *array = new double[length]; // 创建空数组

        for (int i = 0; i < length; ++i) { // 将v8数组转为c++数组
            Local<Value> val = arr->Get(keys->Get(i));
            if (!val->IsNumber()) { // 类型检查
                delete [] array;
                isolate->ThrowException(Exception::TypeError(
                    String::NewFromUtf8(isolate, "Wrong type of arguments!")));
                return;
            } else {
                array[i] = val->NumberValue();
            }
        }

        qSort(array, 0, length - 1); // 快排

        Local<Array> result = Array::New(isolate, length); // 创建v8数组

        for (int i = 0; i < length; ++i) { // 将排序好的c++数组转为v8数组
            result->Set(i, Number::New(isolate, array[i]));
        }        

        delete [] array;

        args.GetReturnValue().Set(result); // 返回值（相当于return）

    } else {
        isolate->ThrowException(Exception::TypeError(
            String::NewFromUtf8(isolate, "Wrong type of arguments!")));
    }

}

void Init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "sort", MyQuickSort); // 将函数设为模块方法，方法名为sort
}

NODE_MODULE(quicksort, Init); // 注册模块，名为quicksort
```
新建一个文件夹作为模块目录，内建src文件夹，将上面代码放在src文件夹，我命名为quicksort.cc。

然后编写binding.gyp文件，保存在模块根目录，基本内容很简单:

```
{
    'targets': [
        {
            'target_name': 'quicksort', // 模块名，要与代码注册的名字相同
            'sources': [
                'src/quicksort.cc'
            ],
        }
    ]
}
```

然后在模块根目录中，输入以下指令编译模块代码:

```
node-gyp configure
node-gyp build
```

编译好的node文件便在build/Release文件夹内，文件名为模块名,接着用require导入使用即可，下面是一个例子:

```
let QuickSort = require('./build/Release/quicksort');

let a = [1, 3, 5, 2, 0];

let b = QuickSort.sort(a);

console.log(b);
// [0, 1, 2, 3, 5]
```
感觉写c++模块关键在于javascript类型和c++类型之间的转换还有模块创建的固定模式，这个Node.js文档没有细讲，好像要去看v8引擎文档才可以，不过现在我还不打算深究就是了。。。。。。