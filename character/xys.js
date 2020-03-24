'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		name:'xys',
		connect:true,
		character:{
			xy_banxuan:['male','shen',4,['xy_chenqing','xy_chengjie'],['zhu']],
			xy_zhoubaifang:['female','shen',3,['xy_hujing','xy_hongzhuan'],['zhu']],
			xy_yaohan:['male','shen',4,['xy_chewang','xy_chewei']],
			xy_baohan:['male','shen',3,['xy_fengxiong','xy_huaji','xy_xiangwu']],
			xy_baoshengjie:['male','shen',3,['xy_guanji','xy_yexing']],
			xy_yangbining:['female','shen',3,['xy_juebi','xy_xinning']],
			xy_hushengda:['male','shen',3,['xy_ouhuang']],
		},
		characterTitle:{
			xy_banxuan:'#r全民男神qwq',
			xy_zhoubaifang:'#b再造共和',
			xy_yaohan:'#b信奥看小说',	
			xy_baohan:'#r吉祥物',
			xy_baoshengjie:'#b鲍爷',
			xy_yangbining:'#g未定',
			xy_hushengda:'#b鬼才欧皇',
		},
		characterIntro:{
			xy_banxuan:'于 V 0.1.0 创建',
			xy_zhoubaifang:'于 V 0.1.0 创建',
			xy_yaohan:'于 V 0.1.0 创建',
			xy_baohan:'于 V 0.1.0 创建',
			xy_baoshengjie:'于 V 0.1.1 创建',
			xy_yangbining:'于 V 0.1.1 创建',
			xy_hushengda:'于 V 0.1.1 创建',
		},
		characterSort:{
			xys:{
				xy_teachers:['xy_banxuan','xy_zhoubaifang'],
				xy_201906:['xy_baohan','xy_yaohan','xy_yangbining','xy_baoshengjie','xy_hushengda'],
				
			},
		},
		skill:{
			xy_chewang:{
				mod:{
					targetEnabled:function(card,player,target,now){
						if(target.isTurnedOver()){
							if(!(card.name=='sha'||card.name=='tao'||card.name=='jiu'||card.name=='juedou')) return false;
						}
					}
				},
			},
			xy_chewei:{
				audio:'jushou',
				trigger:{player:'phaseJieshuBegin'},
				content:function(){
					'step 0'
					player.draw(3);
					'step 1'
					player.chooseCard('h',true,'请选择一张手牌并弃置之，若你选择了一张装备牌则改为装备之。').set('ai',function(card){
						if(get.type(card)=='equip'){
							return 5-get.value(card);
						}
						return -get.value(card);
					}).set('filterCard',lib.filter.cardDiscardable);
					'step 2'
					if(result.bool&&result.cards.length){
						if(get.type(result.cards[0])=='equip'&&!player.isDisabled(get.subtype(result.cards[0]))){
							player.chooseUseTarget(result.cards[0],true,'nopopup');
						}
						else{
							player.discard(result.cards[0]);
						}
					}
					'step 3'
					player.turnOver();
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(card.name=='guiyoujie') return [0,1];
						}
					}
				},
			},
			xy_fengxiong:{
				marktext:"凶",
				init:function(player,skill){
					if(!player.storage[skill]) player.storage[skill]=0;
				},
				intro:{
					content:'逢凶同舟共济，化吉有难同当。',
				},
				mark:true,
				audio:'nzry_huaiju',
				trigger:{
					player:['damageBegin'],
				},
				filter:function(event,player){
					return !event.tachibanaed1;
				},
				content:function(){
					trigger.tachibanaed1=true;
					trigger.cancel();
					player.storage.xy_fengxiong+=trigger.num;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					game.log(player,'将伤害转化为',trigger.num,'枚“凶”标记');
					if (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2)player.useSkill("xy_xiangwu1");
					
					if (trigger.source){
						//if(!trigger.source.storage.xy_fengxiong)trigger.source.storage.xy_fengxiong=0;
						player.line(trigger.source,'green');
						/*trigger.source.storage.xy_fengxiong+=trigger.num;
						trigger.source.syncStorage('xy_fengxiong');
						trigger.source.updateMarks('xy_fengxiong');*/
						if(trigger.source.storage.xy_fengxiong==undefined) trigger.source.storage.xy_fengxiong=0;
						trigger.source.markSkill('xy_fengxiong');
						trigger.source.storage.xy_fengxiong+=trigger.num;
						trigger.source.syncStorage('xy_fengxiong');
						game.log(trigger.source,'因试图对',player,'造成伤害而获得',trigger.num,'枚“凶”标记');
						
						if (trigger.source.storage.xy_fengxiong && trigger.source.storage.xy_fengxiong>=2)trigger.source.useSkill("xy_xiangwu1");
					}
				},
			},
			xy_huaji:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				filter:function(event,player){
					return (player.storage.xy_fengxiong>0);
				},
				content:function(){
					player.storage.xy_fengxiong--;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					player.addTempSkill('xy_huaji1',{player:'phaseBegin'});
				},
			},
			xy_huaji1:{
				marktext:"吉",
				intro:{
					content:'直到你的下回合开始，与你的距离为1的其他角色受到伤害时立即取消之，你与该角色各获得等同于伤害数量的“凶”标记。',
				},
				mark:true,
				trigger:{
					global:['damageBegin'],
				},
				filter:function(event,player){
					return get.distance(player,event.player)<=1&&event.player!=player;
				},
				forced:true,
				content:function(){
					trigger.tachibanaed1=true;
					trigger.cancel();
					player.storage.xy_fengxiong+=trigger.num;
					player.syncStorage('xy_fengxiong');
					player.updateMarks('xy_fengxiong');
					game.log(player,'将针对',trigger.player,'的伤害转化为',trigger.num,'枚“凶”标记');
					
					player.line(trigger.player,'green');
					if(trigger.player.storage.xy_fengxiong==undefined) trigger.player.storage.xy_fengxiong=0;
					trigger.player.markSkill('xy_fengxiong');
					trigger.player.storage.xy_fengxiong+=trigger.num;
					trigger.player.syncStorage('xy_fengxiong');
					game.log(trigger.player,'在',player,'的庇护下将',trigger.num,'点伤害转换为“凶”标记');
					
					if (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2) player.useSkill("xy_xiangwu1");
					if (trigger.player.storage.xy_fengxiong && trigger.player.storage.xy_fengxiong>=2)trigger.player.useSkill("xy_xiangwu1");
				},
			},
			xy_xiangwu1:{
				filter:function(event,player){
					return (player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2);
				},
				content:function(){
					while(player.storage.xy_fengxiong && player.storage.xy_fengxiong>=2){
						player.loseHp();
						player.storage.xy_fengxiong-=2;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
					}
					if(player.storage.xy_fengxiong<=0 && !player.hasSkill("xy_fengxiong")) player.unmarkSkill('xy_fengxiong');
				},
			},
			xy_xiangwu:{
				trigger:{player:['phaseBegin']},
				forced:true,
				filter:function(event,player){
					return player.hp<=Math.floor(player.maxHp/2);
				},
				content:function(){
					if(player.storage.xy_fengxiong){
						player.storage.xy_fengxiong--;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
					}else{
						player.recover();
						player.storage.xy_fengxiong++;
						player.syncStorage('xy_fengxiong');
						player.updateMarks('xy_fengxiong');
					}
				},
			},
			xy_chenqing:{
				audio:2,
				trigger:{global:'dieBefore'},
				filter:function(event,player){return player.maxHp>2&&event.player.maxHp>0&&event.player.hp<=0},
				content:function(){
					'step 0'
					player.loseMaxHp();
					'step 1'
					trigger.cancel();
					trigger.player.discard(trigger.player.getCards('hej'));
					//'step 2'
					//trigger.player.maxHp = player.maxHp;
					//trigger.player.update();
					'step 3'
					//if (trigger.player.hp<trigger.player.maxHp) trigger.player.recover(trigger.player.maxHp-trigger.player.hp);
					if (trigger.player.hp<trigger.player.maxHp) trigger.player.recover(2-trigger.player.hp);
					trigger.player.draw(trigger.player.maxHp+1);
					trigger.player.addSkill('xy_chenqing1');
				},
				check:function(event,player){
					return (player==event.player||0<get.attitude(player,event.player));
				},
			},
			xy_chenqing1:{
				marktext:"警",
				intro:{
					content:'虽然你在一番陈情下逃过一劫，但若你进入濒死状态或受到（失去）足以令你进入濒死状态的伤害（体力），你<strong>直接死亡（跳过濒死和死亡结算）</strong>',
				},
				mark:true,
				trigger:{player:['damageBegin','loseHpBegin']},
				forced:true,
				priority:10000000,
				filter:function(event,player){return event.num&player.hp<=event.num},
				content:function(){
					player.die();
				},
				group:['xy_chenqing2'],
			},
			xy_chenqing2:{
				trigger:{player:['dyingBegin']},
				forced:true,
				priority:10000000,
				content:function(){
					player.die();
				},
			},
			xy_chenqing3:{
				trigger:{player:['dyingAfter']},
				forced:true,
				chat:['你们也该注意点儿！','下不为例！'],
				content:function(){
				    player.chat(lib.skill.xy_chenqing3.chat[Math.floor((Math.random()*2))]);
					trigger.player.addSkill('xy_chenqing1');
					trigger.player.removeSkill('xy_chenqing3');
				},
			},/*
			xy_dongyuan:{
				mark:true,
				marktext:"动",
				intro:{
					function (storage,player){
						if (player.hasSkillI('xy_dongyuan')) return "作为动员者，你不能被动员。";
						if (!player.storage.xy_dongyuan1) return "你已被动员#次。";
						else return "你已被进行过最高动员";
					},
					markcount:function(storage,player){
						if(player.hasSkillI('xy_dongyuan')||player.storage.xy_dongyuan1) return 0;
						return player.storage.xy_dongyuan;
					}
				},
				audio:2,
				enable:'phaseUse',
				filterCard:true,
				usable:1,
				check:function(card){
					return 4-get.value(card)
				},
				filterTarget:function(card,player,target){
					if(target.hasSkillI('xy_dongyuan')) return false;
					if(target.storage.xy_dongyuan1) return false;
					return true;
				},
				content:function(){
					'step 0'
					if(!target.storage.xy_dongyuan){
						target.storage.xy_dongyuan=0;
						target.storage.xy_dongyuan1=false;
					}
					target.storage.xy_dongyuan++;
					target.syncStorage('xy_dongyuan');
					target.updateMarks('xy_dongyuan');
					'step 1'
					if(target.storage.xy_dongyuan>=2){
						var list=[
							'对其造成'+get.translation(target.storage.xy_dongyuan-1)+'点火焰伤害',
							'令其回复'+get.translation(target.storage.xy_dongyuan-1)+'点体力'
						];
						player.chooseControl('对其造成','获得闪').set('prompt','选择一项').set('ai',function(){
							var player=_status.event.player;
							if(player.hasShan()) return 0;
							return 1;
						});
					}
					'step 2'
					if(result.control=='获得杀'){
						player.gain(game.createCard('sha'),'gain2');
					}
					else{
						player.gain(game.createCard('shan'),'gain2');
					}
				},
				ai:{
					order:5.5,
					result:{
						player:function(player){
							if(player.hp<player.maxHp) return 4;
							if(player.countCards('h')>player.hp) return 0
							return -1;
						},
						target:4
					},
					threaten:2,
				}
			},*/
			xy_chengjie:{
				audio:2,
				trigger:{player:'damageEnd'},
				forced:true,
				zhuSkill:true,
				filter:function(event,player){
					return (event.source&&event.num>0&&event.source!=player&&player.hp<=3);
				},
				content:function(){
					trigger.source.storage.xy_chengjie = Math.min(4-player.hp,3);
					trigger.source.addTempSkill('xy_chengjie2',{player:'phaseEnd'});
					if(!trigger.source.hasSkill('fengyin')&&trigger.source.storage.xy_chengjie>=2){
						trigger.source.addTempSkill('fengyin');
					}
				}
			},
			xy_chengjie2:{
				mark:true,
				mod:{
					cardEnabled:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardUsable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardRespondable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
					cardSavable:function(card,player){
						if(player.storage.xy_chengjie>=1 && card.name=="sha")return false;
						if(player.storage.xy_chengjie>=3)return get.suit(card)=="heart"; 
						return true;
					},
				},
				intro:{
					content:function(storage,player){
						var s = "直到你的回合结束：<ul>";
						if(player.storage.xy_chengjie>=1) s = s + "<li>你不能使用或打出【杀】</li>";
						if(player.storage.xy_chengjie>=2) s = s + "<li>你的非锁定技失效</li>";
						if(player.storage.xy_chengjie>=3) s = s + "<li>你不能使用或打出除了红桃牌以外的手牌</li>";
						s = s + "</ul>";
						return s;
					}
				}
			},
			xy_juebi:{
				audio:'xy_juebi1',
				audioname:['xiahouba'],
				group:['xy_juebi1','xy_juebi2','xy_juebi4']
			},
			xy_juebi1:{
				audio:2,
				audioname:['xiahouba'],
				trigger:{player:'phaseJudgeBefore'},
				direct:true,
				content:function(){
					"step 0"
					var check= player.countCards('h')>2;
					player.chooseTarget(get.prompt("xy_juebi"),"跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】",function(card,player,target){
						if(player==target) return false;
						return player.canUse({name:'sha'},target,false);
					}).set('check',check).set('ai',function(target){
						if(!_status.event.check) return 0;
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_juebi1',result.targets);
						player.useCard({name:'sha'},result.targets[0],false);
						trigger.cancel();
						player.skip('phaseDraw');
					}
				}
			},
			xy_juebi2:{
				audio:'xy_juebi1',
				audioname:['xiahouba'],
				trigger:{player:'phaseUseBefore'},
				direct:true,
				filter:function(event,player){
					return player.countCards('he',{type:'equip'})>0;
				},
				content:function(){
					"step 0"
					var check=player.needsToDiscard();
					player.chooseCardTarget({
						prompt:get.prompt('xy_juebi'),
						prompt2:"弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
						filterCard:function(card,player){
							return get.type(card)=='equip'&&lib.filter.cardDiscardable(card,player)
						},
						position:'he',
						filterTarget:function(card,player,target){
							if(player==target) return false;
							return player.canUse({name:'sha'},target,false);
						},
						ai1:function(card){
							if(_status.event.check) return 0;
							return 6-get.value(card);
						},
						ai2:function(target){
							if(_status.event.check) return 0;
							return get.effect(target,{name:'sha'},_status.event.player);
						},
						check:check
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_juebi2',result.targets);
						player.discard(result.cards[0]);
						player.useCard({name:'sha'},result.targets[0]);
						trigger.cancel();
					}
				}
			},
			xy_juebi4:{
				audio:'xy_juebi1',
				audioname:['xiahouba'],
				trigger:{player:'phaseDiscardBefore'},
				direct:true,
				content:function(){
					"step 0"
					var check=player.needsToDiscard()||player.isTurnedOver();
					player.chooseTarget(get.prompt('xy_juebi'),"跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】",function(card,player,target){
						if(player==target) return false;
						return player.canUse({name:'sha'},target,false);
					}).set('check',check).set('ai',function(target){
						if(!_status.event.check) return 0;
						return get.effect(target,{name:'sha'},_status.event.player);
					});
					"step 1"
					if(result.bool){
						player.logSkill('xy_juebi4',result.targets);
						player.turnOver();
						player.useCard({name:'sha'},result.targets[0],false);
						trigger.cancel();
					}
				}
			},
			xy_guanji:{
				audio:2,
				// alter:true,
				trigger:{player:'damageEnd'},
				check:function(event,player){
					if(player.isTurnedOver()||event.num>1) return true;
					var num=game.countPlayer(function(current){
						if(current.countCards('he')&&current!=player&&get.attitude(player,current)<=0){
							return true;
						}
						if(current.countCards('j')&&current!=player&&get.attitude(player,current)>0){
							return true;
						}
					});
					return num>=2;
				},
				content:function(){
					"step 0"
					var targets=game.filterPlayer();
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets=targets;
					event.count=trigger.num;
					"step 1"
					event.num=0;
					player.line(targets,'green');
					"step 2"
					if(num<event.targets.length){
						if(!get.is.altered('xy_guanji')){
							if(event.targets[num].countGainableCards(player,'hej')){
								player.gainPlayerCard(event.targets[num],true,'hej');
							}
						}
						else{
							var hej=event.targets[num].getCards('hej')
							if(hej.length){
								var card=hej.randomGet();
								player.gain(card,event.targets[num]);
								if(get.position(card)=='h'){
									event.targets[num].$giveAuto(card,player);
								}
								else{
									event.targets[num].$give(card,player);
								}
							}
						}
						event.num++;
						event.redo();
					}
					"step 3"
					player.turnOver();
					"step 4"
					event.count--;
					if(event.count){
						player.chooseBool(get.prompt2('xy_guanji'));
					}
					else{
						event.finish();
					}
					"step 5"
					if(event.count&&result.bool){
						event.goto(1);
					}
				},
				ai:{
					maixie:true,
					maixie_hp:true,
					threaten:function(player,target){
						if(target.hp==1) return 2.5;
						return 1;
					},
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'damage')){
								if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
								if(target.hp==1) return 0.8;
								if(target.isTurnedOver()) return [0,3];
								var num=game.countPlayer(function(current){
									if(current.countCards('he')&&current!=player&&get.attitude(player,current)<=0){
										return true;
									}
									if(current.countCards('j')&&current!=player&&get.attitude(player,current)>0){
										return true;
									}
								});
								if(num>2) return [0,1];
								if(num==2) return [0.5,1];
							}
						}
					}
				}
			},
			xy_yexing:{
				mod:{
					globalTo:function(from,to,distance){
						return distance+1;
					}
				}
			},
			xy_xinning:{
				trigger:{player:['respond','useCard']},
				filter:function(event,player){
					return event.card.name=='shan';
				},
				frequent:true,
				init:function(player){
					player.storage.xy_xinning=0;
				},
				content:function(){
					player.storage.xy_xinning++;
					player.markSkill('xy_xinning');
				},
				ai:{
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'respondShan')){
								var shans=target.countCards('h','shan');
								var hs=target.countCards('h');
								if(shans>1) return [1,1];
								if(shans&&hs>2) return [1,1];
								if(shans) return [1,0.5];
								if(hs>2) return [1,0.3];
								if(hs>1) return [1,0.2];
								return [1.2,0];
							}
						}
					},
					threaten:0.8
				},
				intro:{
					content:'mark'
				},
				group:'xy_xinning2'
			},
			xy_xinning2:{
				trigger:{player:'phaseBegin'},
				forced:true,
				filter:function(event,player){
					return player.storage.xy_xinning>0;
				},
				content:function(){
					player.draw(player.storage.xy_xinning);
					player.storage.xy_xinning=0;
					player.unmarkSkill('xy_xinning');
				},
				mod:{
					globalTo:function(from,to,distance){
						if(typeof to.storage.xy_xinning=='number') return distance+to.storage.xy_xinning;
					}
				}
			},
			xy_ouhuang:{
				trigger:{global:'judgeBefore'},
				filter:function(event,player){
					return true;
				},
				mark:true,
				marktext:"欧",
				init:function(player){
					player.storage.xy_ouhuang=0;
					player.storage.xy_ouhuang1=false;
					player.storage.xy_ouhuang2='';
				},
				intro:{
					content:function(storage,player){
						return '你已连续猜对'+get.translation(player.storage.xy_ouhuang)+'次';
					}
				},
				content:function(){
					"step 0"
					player.chooseControl('heart','diamond','club','spade').set('prompt','【欧皇】请选择你要猜的判定牌花色：').set('ai',function(event){
						switch(Math.floor(Math.random()*6)){
							case 0:return 'heart';
							case 1:case 4:case 5:return 'diamond';
							case 2:return 'club';
							case 3:return 'spade';
						}
					});
					"step 1"
					game.log(player,'选择猜'+get.translation(result.control));
					player.storage.xy_ouhuang2=result.control;
					player.storage.xy_ouhuang1=true;
				},
				group:['xy_ouhuang2']
			},
			xy_ouhuang2:{
				//game.me.maxHp = 100;game.me.hp = 100;game.me.update();game.me.next.draw(75);game.me.draw(50);
				audio:2,
				audioname:['re_guojia','xizhicai','gz_nagisa'],
				trigger:{global:'judgeEnd'},
				forced:true,
				filter:function(event,player){
					return player.storage.xy_ouhuang1;
				},
				content:function(){
					player.storage.xy_ouhuang1=false;
					console.log(trigger.result.card.suit);
					if(player.storage.xy_ouhuang2==trigger.result.card.suit){
						player.storage.xy_ouhuang++;
						game.log(player,'猜对了判定牌的',trigger.result.card.suit,'花色，已连续猜对',player.storage.xy_ouhuang,'次。');
						player.syncStorage('xy_ouhuang');
						player.updateMarks('xy_ouhuang');
						var s = player.storage.xy_ouhuang;
						if(s<=1){
							player.draw(1);
							if(!player.hasSkill('bazhen')){
								player.addSkill('bazhen');
							}
						}else if(s==2){
							player.draw(1);
							if(player.hasSkill('guicai')){
								player.recover();
							}else{
								player.addSkill('guicai');
							}
						}else if(s<5){
							player.draw(2);
							if (s==4)player.recover(2);
						}else{
							for(var i=0;i<game.players.length;i++){
								if(game.players[i]==player) continue;
								game.players[i].damage(1,'fire',player);
							}
						}
					}else{
						game.log('判定牌的花色其实是',trigger.result.card.suit,'，',player,'猜错了，欧皇次数清零。');
						player.storage.xy_ouhuang=0;
						player.syncStorage('xy_ouhuang');
						player.updateMarks('xy_ouhuang');
					}
				}
			},
			xy_hujing:{
				enable:'phaseUse',
				filter:function(event,player){
					return !player.hasSkill('subplayer')&&player.getSubPlayers('xy_hujing_get').length>0;
				},
				nosub:true,
				group:'xy_hujing_get',
				direct:true,
				delay:0,
				skillAnimation:true,
				animationColor:'thunder',
				content:function(){
					player.callSubPlayer().set('tag','xy_hujing_get');
				},
				ai:{
					order:1,
					result:{
						player:function(player,target){
							return 1;
							// if(player.hp<=1) return 1;
							// if(!player.needsToDiscard(player.hp-1)) return 1;
							// return 0;
						}
					}
				},
				subSkill:{
					get:{
						trigger:{global:'gameStart',player:['enterGame']},
						forced:true,
						filter:function(event,player){
							return true;
						},
						content:function(){
						    for (var _t=1;_t<=3;_t++) {
    						    var list=[];
            					var list2=[];
            					var players=game.players.concat(game.dead);
            					for(var i=0;i<players.length;i++){
            						list2.add(players[i].name);
            						list2.add(players[i].name1);
            						list2.add(players[i].name2);
            					}
            					for(var i in lib.character){
            						if(lib.character[i][4].contains('boss')) continue;
            						if(lib.character[i][4].contains('minskin')) continue;
            						if(player.getSubPlayers('xy_hujing_get').contains(i)) continue;
            						if(list2.contains(i)) continue;
            						list.push(i);
            					}
            					var name=list.randomGet();
            					var skills=lib.character[name][3];
    							for(var i=0;i<skills.length;i++){
    								if(lib.skill[skills[i]].nosub){
    									skills.splice(i--,1);
    								}
    							}
    							player.addSubPlayer({
    								name:name,
    								skills:skills,
    								sex:lib.character[name][0],
    								hs:get.cards(2),
    								intro:'出牌阶段，你可以调遣此“狐影”（直到“狐影”死亡不可再次切换）'
    							});
						    }
						}
					}
				}
			},
			xy_hongzhuan: {
                trigger: {
                    player: 'useCardAfter'
                },
				frequent:true,
                filter: function(event, player) {
                    return (get.color(event.card) == 'red');
                },
                content: function() {
                    player.draw();
                }
            },
		},
		translate:{
			xy_banxuan:"班轩",
			xy_zhoubaifang:"周柏芳",
			xy_yaohan:"姚涵",
			xy_baohan:"包涵",
			xy_baoshengjie:'鲍圣杰',
			xy_yangbining:"未定",
			xy_hushengda:"胡圣达",

			xy_teachers:'教职工',
			xy_201906:'轩辕六班',
			xy_test:"共研角色",
			
			xy_chewang:"车王",
			xy_chewang_info:"<strong>锁定技</strong>，你处于翻面状态时，除了【杀】、【决斗】、【桃】、【酒】以外，你不能被牌指定为目标。",
			xy_chewei:"车位",
			xy_chewei_info:"结束阶段，你可以获得三张牌并弃置一张手牌，若你选择了一张装备牌，则改为使用之，然后你将你的武将牌翻面。",
			xy_fengxiong:"逢凶",
			xy_fengxiong_info:"每当你受到伤害时，你可以取消之，然后你与伤害来源（如果有）各获得等同于伤害数量的“凶”标记。",
			xy_huaji:"化吉",
			xy_huaji1:"化吉",
			xy_huaji_info:"你的回合结束时，若你有“凶”标记，你可以弃置一枚“凶”标记，然后直到你的下回合开始，与你的距离为1的其他角色受到伤害时立即取消之，你与该角色各获得等同于伤害数量的“凶”标记。",
			xy_xiangwu:"祥物",
			xy_xiangwu1:"祥物",
			xy_xiangwu_info:"<strong>锁定技</strong>，每当场上有角色拥有两枚及以上的“凶”，其须弃置两张“凶”并流失一点体力，然后重复此流程，直到其“凶”的数量在两枚以下；开始阶段，若你的体力值不高于体力上限的一半（向上取整），你可以弃置一枚“凶”标记（有“凶”标记）或获得一点体力并获得一枚“凶”标记（没有“凶”标记）。",
			xy_chenqing:"陈情",
			xy_chenqing1:"下不为例",
			xy_chenqing2:"下不为例",
			xy_chenqing3:"下不为例",
			xy_chenqing_info:"每当一名角色开始进行死亡结算时，若你的体力上限大于2，则你可以另你的体力上限-1，然后取消其死亡结算并弃置其区域内所有牌，令其体力值为2，然后摸等同其体力上限+1的牌，并获得“警”标志（若其进入濒死状态或受到（失去）足以令其进入濒死状态的伤害（体力），其<strong>直接死亡（跳过濒死和死亡结算）</strong>）。",
			xy_chengjie:"禁言",
			xy_chengjie2:"禁言",
			xy_chengjie_info:"<strong>主公技，锁定技</strong>，每当你受到其他角色的伤害时，伤害来源根据你的体力值获得如下效果直到该角色的结束阶段：<br/>≤3：不能使用【杀】；<br/>≤2：非锁定技失效；<br/>≤1：无法使用除红桃牌以外的手牌。",
			xy_juebi:"绝璧",xy_juebi1:"绝璧",xy_juebi2:"绝璧",xy_juebi4:"绝璧",
			//xy_juebi:"未定1",xy_juebi1:"未定1",xy_juebi2:"未定1",xy_juebi4:"未定1",
			xy_juebi_info:'你可以选择一至三项：1. 跳过判定阶段和摸牌阶段；2. 跳过出牌阶段并弃置一张装备牌；3. 跳过弃牌阶段并将你的武将牌翻面。你每选择一项，视为你对一名其他角色使用一张没有距离限制的【杀】',
			xy_guanji:'关机',
			xy_guanji_info:'当你受到1点扣分后，你可以获得每名其他角色区域里的一张牌，然后你翻面',
			xy_guanji_info_alter:'当你受到1点扣分后，你可以随机获得每名其他角色区域里的一张牌，然后你翻面',
			xy_yexing:'爷行',
			xy_yexing_info:'锁定技，其他角色计算与你的距离时+1',
			xy_xinning:'心宁',xy_xinning2:'心宁',
			//xy_xinning:'未定2',xy_xinning2:'未定2',
			xy_xinning_info:'每当你打出一张闪，你可以令你的防御距离+1；准备阶段，你将累计的防御距离清零，然后摸等量的牌',
			xy_ouhuang:'欧皇',
			xy_ouhuang2:'欧皇',
			xy_ouhuang_info:"每当一次判定开始前，你可以选择一种花色，若在判定牌生效后，你所选择的花色与判定牌花色相同，根据你连续猜对的次数获得如下效果：<ol><li>摸一张牌，若你未获得技能【八阵】，你获得之；</li><li>摸一张牌，若你未获得技能【鬼才】，你获得之，否则你回复一点体力；</li><li>摸两张牌；</li><li>摸两张牌，并回复两点体力；</li><li>（及以上）你对所有其他玩家各造成一点火焰伤害。</li>",
			xy_hujing:'狐精',xy_hujing2:'狐精',
			xy_hujing3:'狐精',xy_hujing3_bg:'狐',
			xy_hujing_info:'锁定技，游戏开始时，你从未上场角色中随机获得3个“狐影”；出牌阶段，你可以调遣以此法获得的“狐影”（直到“狐影”死亡不可再次切换，你处于“狐影”状态时你无法使用自己的技能）',
			xy_hongzhuan:"红专",
			xy_hongzhuan_info:"每当你使用一张红色牌时，你摸一张牌。",
			xy_zaihe:"再和",
			xy_zaihe_info:"<strong>主公技</strong>，你可以随机获得角色牌堆中一个主公角色的一个主公技。",
		},
	};
});
